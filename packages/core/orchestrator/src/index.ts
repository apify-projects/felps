import * as CONST from '@usefelps/constants';
import Flow from '@usefelps/flow';
import RequestMeta from '@usefelps/request-meta';
import Queue from '@usefelps/request-queue';
import State from '@usefelps/state';
import Step from '@usefelps/step';
import Trail from '@usefelps/trail';
import TrailDataRequests from '@usefelps/trail--data-requests';
import * as FT from '@usefelps/types';

export const create = (actor: FT.ActorInstance): FT.OrchestratorInstance => {
    return {
        async handler(context: FT.RequestContext): Promise<void> {
            const trails = await State.load(actor?.stores?.trails as FT.StateInstance);
            const trail = Trail.createFrom(context?.request, { state: trails });
            const ingest = Trail.ingested(trail);
            const digest = Trail.digested(trail);

            const meta = RequestMeta.create(context);
            const { actorName } = meta.data;

            // Handle all new flow start requests
            for (const trailId of State.keys(trails)) {
                const trailInstance = Trail.create({ id: trailId, state: trails });
                const ingestLocal = Trail.ingested(trailInstance);
                const digestLocal = Trail.digested(trailInstance);
                const newRequests = TrailDataRequests.getItemsList(ingestLocal.requests).filter(TrailDataRequests.filterByFlowStart);
                for (const newRequest of newRequests) {
                    Trail.promote(trailInstance, newRequest);
                    const metaLocal = RequestMeta.create(newRequest.source);
                    TrailDataRequests.setStatus(digestLocal.requests, CONST.REQUEST_STATUS.QUEUED, metaLocal.data.requestKey);
                    try {
                        await Queue.add(actor?.queues?.default, metaLocal.request, { crawlerMode: metaLocal.data.crawlerMode });
                    } catch (error) {
                        TrailDataRequests.setStatus(digest.requests, CONST.REQUEST_STATUS.CREATED, metaLocal.data.requestKey);
                    }
                }
            }

            // INGESTED Stage
            const newlyCreatedRequests = TrailDataRequests.getItemsListByStatus(ingest.requests, ['CREATED', 'FAILED']);
            for (const newRequest of newlyCreatedRequests) {

                const metaLocal = RequestMeta.create(newRequest.source);
                const flowLocal = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, metaLocal.data.flowName)];
                const stepIsPartofFlow = !!flowLocal && Flow.has(flowLocal, metaLocal.data.stepName);

                if (stepIsPartofFlow) {
                    Trail.promote(trail, newRequest);
                } else {
                    TrailDataRequests.setStatus(ingest.requests, CONST.REQUEST_STATUS.DISCARDED, metaLocal.data.requestKey);
                }
            };

            // DIGESTED Stage
            const newRequests = TrailDataRequests.getItemsListByStatus(digest.requests, 'CREATED');
            for (const newRequest of newRequests) {
                const metaLocal = RequestMeta.create(newRequest.source);

                // TODO: Add filtering here
                // Check if need more data or not (to avoid unnecessary requests)

                if (metaLocal.data.requestKey) {
                    TrailDataRequests.setStatus(digest.requests, CONST.REQUEST_STATUS.QUEUED, metaLocal.data.requestKey);
                    try {
                        await Queue.add(actor?.queues?.default, metaLocal.request, { crawlerMode: metaLocal.data.crawlerMode });
                    } catch (error) {
                        TrailDataRequests.setStatus(digest.requests, CONST.REQUEST_STATUS.CREATED, metaLocal.data.requestKey);
                    }
                }
            };

            // REQUESTS DONE
            const remainingRequests = TrailDataRequests.getItemsListByStatus(digest.requests, ['CREATED', 'QUEUED', 'STARTED', 'FAILED']);
            const trailEnded = remainingRequests.length === 0;

            if (trailEnded) {
                // Run FLOW_ENDED hook
                await Step.run(actor?.hooks?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, 'FLOW_ENDED') as 'FLOW_ENDED'] as FT.StepInstance, actor, context);
            }
        },
    };
};

export const run = async (orchestrator: FT.OrchestratorInstance, context: FT.RequestContext, api: FT.ReallyAny) => {
    await orchestrator.handler(context, api);
};

export default { create, run };
