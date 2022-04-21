import { CrawlingContext } from 'apify';
import { Queue, RequestMeta, Trail } from '.';
import { REQUEST_STATUS } from './common/consts';
import { ActorInstance, GenerateStepApi, OrchestratorInstance } from './common/types';
import TrailDataRequests from './trail-data-requests';

export const create = (actor: ActorInstance): OrchestratorInstance => {
    return {
        async handler(context: CrawlingContext): Promise<void> {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);
            const digest = Trail.digested(trail);

            // All about requests from here on ------------------------------------------------------

            // INGESTED Stage
            const newlyCreatedRequests = TrailDataRequests.getItemsListByStatus(ingest.requests, REQUEST_STATUS.CREATED);
            for (const newRequest of newlyCreatedRequests) {
                // TODO: Add filtering here
                // ...
                Trail.promote(trail, newRequest);
            };

            // DIGESTED Stage
            const newRequests = TrailDataRequests.getItemsListByStatus(digest.requests, REQUEST_STATUS.CREATED);
            for (const newRequest of newRequests) {
                // TODO: Add filtering here
                const meta = RequestMeta.create(newRequest.source);
                await Queue.add(actor.queues.default, meta.request, { type: meta.data.crawlerMode });
                TrailDataRequests.setStatus(digest.requests, REQUEST_STATUS.QUEUED, { requestKey: meta.data.reference.requestKey });
            };

            // All about models from here on ------------------------------------------------------------
        },
    };
};

export const run = async (orchestrator: OrchestratorInstance, context: CrawlingContext, api: GenerateStepApi<unknown, unknown, Record<string, unknown>>) => {
    await orchestrator.handler(context, api);
};

export default { create, run };
