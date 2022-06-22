/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CONST from '@usefelps/constants';
import RequestMeta from '@usefelps/request-meta';
import Step from '@usefelps/step';
// import ContextApi from '@usefelps/context-api';
import Trail from '@usefelps/trail';
import TrailDataRequests from '@usefelps/trail--data-requests';
// import Logger from '@usefelps/logger';
import * as FT from '@usefelps/types';

export default (actor: FT.ActorInstance) => {
    return async (context: FT.RequestContext) => {
        // const meta = RequestMeta.create(context);
        // const metaHook = RequestMeta.extend(meta, { isHook: true });
        // const contextHook = {
        //     ...context,
        //     request: metaHook.request,
        // } as FT.RequestContext;

        // const actorKey = meta.data.reference.fActorKey as string;
        // const trail = Trail.createFrom(context.request, { actor });
        // const digest = Trail.digested(trail);

        // // Run a general hook
        // await Step.run(actor.hooks?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, 'STEP_FAILED') as 'STEP_FAILED'] as FT.StepInstance, actor, contextHook);

        // const stepInstance = actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.stepName)];
        // if (!stepInstance) {
        //     // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
        //     return;
        // }

        // TrailDataRequests.setStatus(digest.requests, 'DISCARDED', meta.data.reference);

        // // try {
        // //     await stepInstance?.errorHandler?.(context, ContextApi.create<FT.ReallyAny, FT.ReallyAny, FT.ReallyAny, FT.ReallyAny>(actor)(context));
        // // } catch (err) {
        // //     Logger.error(Logger.create(stepInstance), `Error happened within step errorHandler: ${meta.data.stepName}`, { err });
        // // };
    };
};
