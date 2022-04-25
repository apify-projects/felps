import { CrawlingContext } from 'apify';
import { Dataset, Flow, Queue, RequestMeta, Trail } from '.';
import { MODEL_STATUS, REQUEST_STATUS } from './consts';
import { ActorInstance, StepApiInstance, OrchestratorInstance, QueueInstance, reallyAny } from './types';
import TrailDataRequests from './trail-data-requests';
import TrailDataModel from './trail-data-model';

export const create = (actor: ActorInstance): OrchestratorInstance => {
    return {
        async handler(context: CrawlingContext): Promise<void> {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);
            const digest = Trail.digested(trail);

            // All about requests from here on ------------------------------------------------------

            // INGESTED Stage
            const newlyCreatedRequests = TrailDataRequests.getItemsListByStatus(ingest.requests, 'CREATED');
            for (const newRequest of newlyCreatedRequests) {
                // TODO: Add filtering here
                // ...
                const meta = RequestMeta.create(newRequest.source);
                const flow = actor.flows?.[meta.data.flowName];
                if (flow && Flow.has(flow, meta.data.stepName)) {
                    Trail.promote(trail, newRequest);
                } else {
                    TrailDataRequests.setStatus(ingest.requests, REQUEST_STATUS.DISCARDED, meta.data.reference);
                }
            };

            // DIGESTED Stage
            const newRequests = TrailDataRequests.getItemsListByStatus(digest.requests, 'CREATED');
            for (const newRequest of newRequests) {
                // TODO: Add filtering here
                const meta = RequestMeta.create(newRequest.source);
                if (meta.data.reference) {
                    await Queue.add(actor?.queues?.default as QueueInstance, meta.request, { type: meta.data.crawlerMode });
                    TrailDataRequests.setStatus(digest.requests, REQUEST_STATUS.QUEUED, meta.data.reference);
                }
            };

            // All about models from here on ------------------------------------------------------------
            // INGESTED Stage
            for (const modelName of Object.keys(actor?.models)) {
                const newlyCreatedItems = TrailDataModel.getItemsListByStatus(ingest.models[modelName], ['CREATED', 'UPDATED']);
                for (const newItem of newlyCreatedItems) {
                    // TODO: Add filtering here
                    // ...
                    Trail.promote(trail, newItem);
                };
            }

            // DIGESTED Stage
            for (const modelName of Object.keys(actor?.models)) {
                const newItems = TrailDataModel.getItemsListByStatus(digest.models[modelName], ['CREATED', 'UPDATED']);
                for (const newItem of newItems) {
                    const remainingRequests = TrailDataRequests.getItemsListByStatus(digest.requests, 'QUEUED', newItem.reference);
                    if (!remainingRequests.length) {
                        // TODO: Filter items that can be outputed to dataset
                        await Dataset.push(actor?.datasets?.default, newItem.data);
                        TrailDataModel.setStatus(digest.models[modelName], MODEL_STATUS.PUSHED, newItem.reference);
                    }
                }
            };
        },
    };
};

export const run = async (orchestrator: OrchestratorInstance, context: CrawlingContext, api: StepApiInstance<reallyAny, reallyAny, reallyAny>) => {
    await orchestrator.handler(context, api);
};

export default { create, run };
