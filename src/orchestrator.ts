import hash from 'object-hash';
import { Dataset, DataStore, Flow, Model, Queue, RequestMeta, Step, StepApi, Trail, Trails } from '.';
import { MODEL_STATUS, PREFIXED_NAME_BY_ACTOR, REQUEST_STATUS } from './consts';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';
import {
    ActorInstance, FlowInstance, OrchestratorInstance, QueueInstance,
    ReallyAny, RequestContext, StepApiInstance, StepInstance,
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

            const flow = meta.data.flowName ? actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny> : undefined;

            const stepApi = StepApi.create(actor);
            const api = stepApi(context);
            const connectedModel = Model.connect({ api });

            const stopedReferencesHashes = new Set<string>();

            // Handle all new flow start requests
            for (const trailInstance of Trails.getItemsList(trails)) {
                const ingestLocal = Trail.ingested(trailInstance);
                const digestLocal = Trail.digested(trailInstance);
                const newRequests = TrailDataRequests.getItemsList(ingestLocal.requests).filter(TrailDataRequests.filterByFlowStart);

                for (const newRequest of newRequests) {
                    Trail.promote(trailInstance, newRequest);
                    const metaLocal = RequestMeta.create(newRequest.source);
                    await Queue.add(actor?.queues?.default as QueueInstance, metaLocal.request, { type: metaLocal.data.crawlerMode });
                    TrailDataRequests.setStatus(digestLocal.requests, REQUEST_STATUS.QUEUED, metaLocal.data.reference);
                }
            }

            // Analyse the trail to determine which models are now stoped
            if (!flow) { return; };

            const outputModels = Model.flatten(flow?.output);
            for (const model of outputModels) {
                const ingestModel = ingest.models[model.name];
                if (ingestModel) {
                    const entities = TrailDataModel.getItemsList(ingestModel);
                    const entitiesByParentHash = TrailDataModel.groupByParentHash(ingestModel, entities);
                    for (const parentRefHash of entitiesByParentHash.keys()) {
                        const entitiesOrganised = await connectedModel.organizeList(model, entitiesByParentHash.get(parentRefHash) as []);
                        const listIsComplete = await connectedModel.isListComplete(model, entitiesOrganised.valid);
                        // console.log({ model: model.name, stop})
                        if (listIsComplete) {
                            stopedReferencesHashes.add(parentRefHash);
                            // console.log(parentRefHash, entitiesByParentHash.get(parentRefHash))
                        }
                    }
                }
            }

            // REQUESTS ------------------------------------------------------
            // INGESTED Stage
            const newlyCreatedRequests = TrailDataRequests.getItemsListByStatus(ingest.requests, 'CREATED');
            for (const newRequest of newlyCreatedRequests) {
                // TODO: Add filtering here
                // ...
                const metaLocal = RequestMeta.create(newRequest.source);
                const flowLocal = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, metaLocal.data.flowName)];
                const stepIsPartofFlow = !!flowLocal && Flow.has(flowLocal, metaLocal.data.stepName);

                const requestIsLimited = stopedReferencesHashes.has(hash(metaLocal?.data?.reference));
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
                    await Queue.add(actor?.queues?.default as QueueInstance, metaLocal.request, { type: metaLocal.data.crawlerMode });
                    TrailDataRequests.setStatus(digest.requests, REQUEST_STATUS.QUEUED, metaLocal.data.reference);
                }
            };

            // REQUESTS DONE
            const remainingRequests = TrailDataRequests.getItemsListByStatus(digest.requests, ['CREATED', 'QUEUED', 'STARTED']);
            const trailEnded = remainingRequests.length === 0;

            if (trailEnded) {
                // Run FLOW_ENDED hook
                await Step.run(actor?.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'FLOW_ENDED') as 'FLOW_ENDED'] as StepInstance, actor, context);

                // MODELS ------------------------------------------------------------

                // INGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const items = TrailDataModel.getItemsListByStatus(ingest.models[modelName], ['CREATED']);

                    const filteredAs = await connectedModel.organizeList(ingest.models[modelName].model, items);

                    for (const validItem of filteredAs.valid) {
                        Trail.promote(trail, validItem);
                    };

                    for (const invalidItem of filteredAs.invalid) {
                        TrailDataModel.setStatus(ingest.models[modelName], MODEL_STATUS.DISCARDED, invalidItem.reference);
                    }
                }

                // DIGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const newItems = TrailDataModel.getItemsListByStatus(digest.models[modelName], ['CREATED']);
                    for (const newItem of newItems) {
                        TrailDataModel.setStatus(digest.models[modelName], MODEL_STATUS.PUSHED, newItem.reference);
                    }
                };

                // Resolve models
                const results = Trail.resolve(trail, flow?.output);
                const resultsAsArray = Array.isArray(results) ? results : [results];
                for (const result of resultsAsArray) {
                    const { valid: isValid, errors } = Model.validate(flow.output, result);
                    if (isValid) {
                        await Dataset.push(actor?.datasets?.default, result);
                    } else {
                        DataStore.setAndGetKey(actor?.stores?.incorrectDataset, { result, errors });
                    }
                }
            }
        },
    };
};

export const run = async (orchestrator: OrchestratorInstance, context: RequestContext, api: StepApiInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>) => {
    await orchestrator.handler(context, api);
};

export default { create, run };
