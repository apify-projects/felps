import { Dataset, Flow, Model, Models, Queue, RequestMeta, StepApi, Trail } from '.';
import { MODEL_STATUS, REQUEST_STATUS } from './consts';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';
import { ActorInstance, OrchestratorInstance, QueueInstance, reallyAny, RequestContext, StepApiInstance } from './types';
import { everyAsync } from './utils';

export const create = (actor: ActorInstance): OrchestratorInstance => {
    return {
        async handler(context: RequestContext): Promise<void> {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);
            const digest = Trail.digested(trail);

            // const meta = RequestMeta.create(context);
            // const flow = actor.flows?.[meta.data.flowName];

            const stepApi = StepApi.create(actor);
            const connectedModel = Model.connect({ api: stepApi(context) });

            // REQUESTS ------------------------------------------------------

            // INGESTED Stage
            const newlyCreatedRequests = TrailDataRequests.getItemsListByStatus(ingest.requests, 'CREATED');
            for (const newRequest of newlyCreatedRequests) {
                // TODO: Add filtering here
                // ...
                const metaLocal = RequestMeta.create(newRequest.source);
                const flowLocal = actor.flows?.[metaLocal.data.flowName];
                const matchedModels = Models.matches(actor.models, metaLocal.data.reference);

                const stepIsPartofFlow = !!flowLocal && Flow.has(flowLocal, metaLocal.data.stepName);
                const limitNotReachedByAnyModel = await everyAsync(matchedModels, async (model) => {
                    const items = TrailDataModel.getItemsList(digest.models[model.name])
                        .filter(TrailDataModel.filterByStatus('CREATED'))
                        .filter(TrailDataModel.filterByPartial(false));
                    const organizedItems = await connectedModel.organize(model, items).then(({ valid }) => valid);
                    return connectedModel.limit(model, organizedItems);
                });

                const requestShouldBeQueued = stepIsPartofFlow && (true || limitNotReachedByAnyModel);

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
                // MODELS ------------------------------------------------------------

                // INGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const items = TrailDataModel.getItemsListByStatus(ingest.models[modelName], ['CREATED']);

                    const filteredAs = await connectedModel.organize(ingest.models[modelName].model, items);

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
                        // TODO: Filter items that can be outputed to dataset
                        await Dataset.push(actor?.datasets?.default, newItem.data);
                        TrailDataModel.setStatus(digest.models[modelName], MODEL_STATUS.PUSHED, newItem.reference);
                    }
                };
            }
        },
    };
};

export const run = async (orchestrator: OrchestratorInstance, context: RequestContext, api: StepApiInstance<reallyAny, reallyAny, reallyAny>) => {
    await orchestrator.handler(context, api);
};

export default { create, run };
