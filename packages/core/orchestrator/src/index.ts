import * as CONST from '@usefelps/constants';
import Flow from '@usefelps/flow';
import RequestMeta from '@usefelps/request-meta';
import RequestQueue from '@usefelps/request-queue';
import ContextApi from '@usefelps/context-api';
import State from '@usefelps/state';
import Hook from '@usefelps/hook';
import Trail from '@usefelps/trail';
import TrailDataRequests from '@usefelps/trail--data-requests';
import * as FT from '@usefelps/types';

export const create = (actor: FT.ActorInstance): FT.OrchestratorInstance => {
    return {
        async handler(context: FT.RequestContext): Promise<void> {
            const { trails } = (actor?.stores || {}) as { trails: FT.StateInstance }
            const trail = Trail.createFrom(context?.request, { state: trails });
            const ingested = Trail.ingested(trail);
            const digested = Trail.digested(trail);

            const contextApi = ContextApi.create(actor);

            const meta = RequestMeta.create(context);
            const { actorName } = meta.data;

            const currentFlow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, CONST.UNPREFIXED_NAME_BY_ACTOR(meta.data.flowName))]

            // Handle all new flow start requests
            for (const trailId of State.keys(trails)) {
                const trailInstance = Trail.create({ id: trailId, state: trails });
                const ingestLocal = Trail.ingested(trailInstance);
                const digestLocal = Trail.digested(trailInstance);
                const newRequests = TrailDataRequests.getItemsList(ingestLocal.requests).filter(TrailDataRequests.filterByFlowStart);
                for (const newRequest of newRequests) {
                    Trail.promote(trailInstance, newRequest);
                    const metaLocal = RequestMeta.create(newRequest.source);
                    TrailDataRequests.setStatus(digestLocal.requests, CONST.REQUEST_STATUS.QUEUED, metaLocal.data.requestId);
                    try {
                        await RequestQueue.add(actor?.queues?.default, metaLocal.request, { crawlerMode: metaLocal.data.crawlerMode });
                    } catch (error) {
                        TrailDataRequests.setStatus(digested.requests, CONST.REQUEST_STATUS.CREATED, metaLocal.data.requestId);
                    }
                }
            }

            const stopTrailNow = Trail.get(trail).status === 'STOPPED';

            // INGESTED Stage
            const newlyCreatedRequests = TrailDataRequests.getItemsListByStatus(ingested.requests, ['CREATED', 'TO_BE_RETRIED']);
            for (const newRequest of newlyCreatedRequests) {

                const metaLocal = RequestMeta.create(newRequest.source);
                const flowLocal = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, metaLocal.data.flowName)];
                const stepIsPartofFlow = !!flowLocal && Flow.has(flowLocal, metaLocal.data.stepName);

                if (!stepIsPartofFlow || stopTrailNow) {
                    TrailDataRequests.setStatus(ingested.requests, CONST.REQUEST_STATUS.DISCARDED, metaLocal.data.requestId);
                } else {
                    Trail.promote(trail, newRequest);
                }
            };

            // DIGESTED Stage
            const newRequests = TrailDataRequests.getItemsListByStatus(digested.requests, 'CREATED');
            for (const newRequest of newRequests) {
                const metaLocal = RequestMeta.create(newRequest.source);

                // TODO: Add filtering here
                // Check if need more data or not (to avoid unnecessary requests)

                if (metaLocal.data.requestId) {
                    TrailDataRequests.setStatus(digested.requests, CONST.REQUEST_STATUS.QUEUED, metaLocal.data.requestId);
                    try {
                        await RequestQueue.add(actor?.queues?.default, metaLocal.request, { crawlerMode: metaLocal.data.crawlerMode });
                    } catch (error) {
                        TrailDataRequests.setStatus(digested.requests, CONST.REQUEST_STATUS.CREATED, metaLocal.data.requestId);
                    }
                }
            };

            // REQUESTS DONE
            const remainingRequests = TrailDataRequests.getItemsListByStatus(digested.requests, ['CREATED', 'QUEUED', 'STARTED', 'TO_BE_RETRIED']);
            const succeededRequests = TrailDataRequests.getItemsListByStatus(digested.requests, ['SUCCEEDED']);
            const trailEnded = remainingRequests.length === 0 && succeededRequests.length > 0;

            if (trailEnded) {

                const failedRequests = TrailDataRequests.getItemsListByStatus(digested.requests, ['FAILED']);
                if (failedRequests.length) {
                    Trail.setStatus(trail, 'FAILED');
                } else {
                    Trail.setStatus(trail, 'COMPLETED');
                }

                await Hook.run(currentFlow?.hooks?.postEndedHook, context, contextApi(context), actor);

                await Hook.run(actor?.hooks?.postFlowEndedHook, actor, context, contextApi(context));
            }
        },
    };
};

export const run = async (orchestrator: FT.OrchestratorInstance, context: FT.RequestContext, api: FT.ReallyAny) => {
    await orchestrator.handler(context, api);
};

export default { create, run };
