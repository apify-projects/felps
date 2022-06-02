import hash from 'object-hash';
import { Dataset, DataStore, Flow, Model, Queue, RequestMeta, Step, StepApi, Trail, Trails } from '.';
import { MODEL_STATUS, PREFIXED_NAME_BY_ACTOR, REQUEST_STATUS } from './consts';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';
import {
    ActorInstance, OrchestratorInstance, QueueInstance,
    ReallyAny, RequestContext, StepInstance
} from './types';

export const create = (actor: ActorInstance): OrchestratorInstance => {
    return {
        async handler(context: RequestContext): Promise<void> {
            const trails = Trails.create({ actor });
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);
            const digest = Trail.digested(trail);

            const meta = RequestMeta.create(context);
            const actorKey = meta.data.reference.fActorKey as string;

            // const flow = meta.data.flowName ? actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny> : undefined;

            const stepApi = StepApi.create<ReallyAny, ReallyAny, ReallyAny, ReallyAny>(actor);
            const api = stepApi(context);
            const connectedModel = Model.connect({ api });

            const stoppedReferencesHashes = new Set<string>();
            const allowedReferencesHashes = new Set<string>();

            // Handle all new flow start requests
            for (const trailInstance of Trails.getItemsList(trails)) {
                const ingestLocal = Trail.ingested(trailInstance);
                const digestLocal = Trail.digested(trailInstance);
                const newRequests = TrailDataRequests.getItemsList(ingestLocal.requests).filter(TrailDataRequests.filterByFlowStart);
                for (const newRequest of newRequests) {
                    Trail.promote(trailInstance, newRequest);
                    const metaLocal = RequestMeta.create(newRequest.source);
                    TrailDataRequests.setStatus(digestLocal.requests, REQUEST_STATUS.QUEUED, metaLocal.data.reference);
                    try {
                        await Queue.add(actor?.queues?.default as QueueInstance, metaLocal.request, { crawlerOptions: metaLocal.data.crawlerOptions });
                    } catch (error) {
                        TrailDataRequests.setStatus(digest.requests, REQUEST_STATUS.CREATED, metaLocal.data.reference);
                    }
                }
            }

            const mainFlowName = Trail.getMainFlow(trail)?.name;
            // Analyse the trail to determine which models are now stoped
            // if (!flow) { return; };
            if (!mainFlowName) {
                throw new Error(`No main flow found: ${mainFlowName}`);
            };
            const mainFlow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, mainFlowName)];

            const outputModels = Model.flatten(mainFlow?.output);
            for (const model of outputModels) {
                const ingestModel = ingest.models[model.name];
                if (ingestModel) {
                    const entities = TrailDataModel.getItemsList(ingestModel);
                    // const entitiesByParentHash = TrailDataModel.groupByParentHash({ ...ingestModel, model }, entities);
                    const entitiesByParentHash = TrailDataModel.groupByParentHash(ingestModel, entities);
                    for (const parentRefHash of entitiesByParentHash.keys()) {
                        const outputModel = Model.dependency(mainFlow.output, model.name);
                        if (outputModel) {
                            const entitiesOrganised = await connectedModel.organizeList(outputModel, entitiesByParentHash.get(parentRefHash) as []);
                            const listIsComplete = await connectedModel.isListComplete(outputModel, entitiesOrganised.valid);
                            // console.log({ model: model.name, stop})
                            if (listIsComplete) {
                                stoppedReferencesHashes.add(parentRefHash);
                                for (const entity of entitiesOrganised.valid) {
                                    allowedReferencesHashes.add(hash(entity.reference));
                                }
                                // console.log(parentRefHash, entitiesByParentHash.get(parentRefHash))
                            }
                        }
                    }
                }
            }

            // REQUESTS ------------------------------------------------------
            // INGESTED Stage
            const newlyCreatedRequests = TrailDataRequests.getItemsListByStatus(ingest.requests, ['CREATED', 'FAILED']);
            for (const newRequest of newlyCreatedRequests) {
                // TODO: Add filtering here
                // ...
                const metaLocal = RequestMeta.create(newRequest.source);
                const flowLocal = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, metaLocal.data.flowName)];
                const stepIsPartofFlow = !!flowLocal && Flow.has(flowLocal, metaLocal.data.stepName);

                const referenceHash = hash(metaLocal?.data?.reference);
                const requestIsLimited = stoppedReferencesHashes.has(referenceHash) && !allowedReferencesHashes.has(referenceHash);
                const requestShouldBeQueued = stepIsPartofFlow && !requestIsLimited;

                // console.log({
                //     ref: metaLocal?.data?.reference,
                //     hash: hash(metaLocal?.data?.reference),
                //     stepIsPartofFlow,
                //     flowLocal,
                //     requestIsLimited,
                //     requestShouldBeQueued,
                // });

                if (requestShouldBeQueued) {
                    Trail.promote(trail, newRequest);
                } else {
                    TrailDataRequests.setStatus(ingest.requests, REQUEST_STATUS.DISCARDED, metaLocal.data.reference);
                }
            };

            // DIGESTED Stage
            const newRequests = TrailDataRequests.getItemsListByStatus(digest.requests, 'CREATED');
            for (const newRequest of newRequests) {
                const metaLocal = RequestMeta.create(newRequest.source);

                // TODO: Add filtering here
                // Check if need more data or not (to avoid unnecessary requests)

                if (metaLocal.data.reference) {
                    TrailDataRequests.setStatus(digest.requests, REQUEST_STATUS.QUEUED, metaLocal.data.reference);
                    try {
                        await Queue.add(actor?.queues?.default as QueueInstance, metaLocal.request, { crawlerOptions: metaLocal.data.crawlerOptions });
                    } catch (error) {
                        TrailDataRequests.setStatus(digest.requests, REQUEST_STATUS.CREATED, metaLocal.data.reference);
                    }
                }
            };

            // REQUESTS DONE
            const remainingRequests = TrailDataRequests.getItemsListByStatus(digest.requests, ['CREATED', 'QUEUED', 'STARTED', 'FAILED']);
            const trailEnded = remainingRequests.length === 0;

            if (trailEnded) {
                // Run FLOW_ENDED hook
                await Step.run(actor?.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'FLOW_ENDED') as 'FLOW_ENDED'] as StepInstance, actor, context);

                // MODELS ------------------------------------------------------------

                // Resolve models
                // INGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const items = TrailDataModel.getItemsListByStatus(ingest.models[modelName], ['CREATED']);

                    const outputModel = Model.dependency(mainFlow.output, modelName);
                    if (outputModel) {
                        const filteredAs = await connectedModel.organizeList(outputModel, items);

                        for (const validItem of filteredAs.valid) {
                            Trail.promote(trail, validItem);
                        };

                        for (const invalidItem of filteredAs.invalid) {
                            TrailDataModel.setStatus(ingest.models[modelName], MODEL_STATUS.DISCARDED, invalidItem.reference);
                        }
                    }
                }

                // DIGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const newItems = TrailDataModel.getItemsListByStatus(digest.models[modelName], ['CREATED']);
                    for (const newItem of newItems) {
                        TrailDataModel.setStatus(digest.models[modelName], MODEL_STATUS.PUSHED, newItem.reference);
                    }
                };

                const results = Trail.resolve(trail, mainFlow?.output);
                const resultsAsArray = Array.isArray(results) ? results : [results];
                for (const result of resultsAsArray) {
                    const { valid: isValid, errors } = Model.validate(mainFlow.output, result);
                    const decoratedResults = isValid ? { success: true, ...result } : { errors, success: false, ...result };
                    const { valid: isDecoratedValid } = Model.validate(mainFlow.output, decoratedResults);
                    if (isDecoratedValid) {
                        await Dataset.push(actor?.datasets?.default, decoratedResults);
                    } else {
                        DataStore.setAndGetKey(actor?.stores?.incorrectDataset, decoratedResults);
                    }
                }
            }
        },
    };
};

export const run = async (orchestrator: OrchestratorInstance, context: RequestContext, api: ReallyAny) => {
    await orchestrator.handler(context, api);
};

export default { create, run };
