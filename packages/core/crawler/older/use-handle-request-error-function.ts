/* eslint-disable @typescript-eslint/no-explicit-any */
import { PREFIXED_NAME_BY_ACTOR } from '@usefelps/constants';
import RequestMeta from '@usefelps/request-meta';
import Orchestrator from '@usefelps/orchestrator';
import Step from '@usefelps/step';
import ContextApi from '@usefelps/context-api';
import * as FT from '@usefelps/types';

export default (actor: FT.ActorInstance) => {
    return async (context: FT.RequestContext) => {
        const meta = RequestMeta.create(context);
        const metaHook = RequestMeta.extend(meta, { isHook: true });
        const contextHook = {
            ...context,
            request: metaHook.request,
        } as FT.RequestContext;

        const actorKey = meta.data.reference.fActorKey as string;

        // Run a general hook
        await Step.run(actor.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'STEP_REQUEST_FAILED') as 'STEP_REQUEST_FAILED'] as FT.StepInstance, actor, contextHook);

        const stepInstance = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.stepName)];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }

        await stepInstance?.requestErrorHandler?.(context, ContextApi.create<FT.ReallyAny, FT.ReallyAny, FT.ReallyAny, FT.ReallyAny>(actor)(context));

        if (stepInstance?.handler) {
            await Orchestrator.run(Orchestrator.create(actor), context, ContextApi.create<FT.ReallyAny, FT.ReallyAny, FT.ReallyAny, FT.ReallyAny>(actor)(context));
        };
    };
};
