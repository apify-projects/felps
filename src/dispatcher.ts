import { CrawlingContext } from 'apify';
import { Trail } from '.';
import { ActorInstance, DispatcherInstance } from './common/types';
import TrailDataRequests from './trail-data-requests';

// actor: ActorInstance
export const create = (actor: ActorInstance): DispatcherInstance => {
    return {
        async handler(context: CrawlingContext) {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);
            // const digest = Trail.digested(trail);

            for (const request of TrailDataRequests.getRequestItemsList(ingest.requests)) {
                // Do something with request
                console.log(request);
            };
        },
    };
};

export const run = async (dispatcher: DispatcherInstance, context: CrawlingContext) => {
    await dispatcher.handler(context);
};

export default { create, run };
