import { CrawlingContext } from 'apify';
import { Queue, RequestMeta, Trail } from '.';
import { ActorInstance, GenerateStepApi, OrchestratorInstance } from './common/types';
import TrailDataRequests from './trail-data-requests';

export const create = (actor: ActorInstance): OrchestratorInstance => {
    return {
        async handler(context: CrawlingContext): Promise<void> {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);

            // All about requests from here on ------------------------------------------------------

            const newRequests = TrailDataRequests.getRequestItemsList(ingest.requests);
            for (const newRequest of newRequests) {
                // TODO: Add filtering here
                const meta = RequestMeta.create(newRequest);
                await Queue.add(actor.queues.default, meta.request, { type: meta.data.crawlerMode });
            };

            // All about models from here on ------------------------------------------------------------
        },
    };
};

export const run = async (orchestrator: OrchestratorInstance, context: CrawlingContext, api: GenerateStepApi<unknown, unknown, Record<string, unknown>>) => {
    await orchestrator.handler(context, api);
};

export default { create, run };
