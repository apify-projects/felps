/* eslint-disable @typescript-eslint/no-explicit-any */
import { Step, StepApi } from '..';
import { PREFIXED_NAME_BY_ACTOR } from '../consts';
import RequestMeta from '../request-meta';
import { ActorInstance, RequestContext, StepInstance } from '../types';

export default (actor: ActorInstance) => {
    return async (context: RequestContext) => {
        const meta = RequestMeta.create(context);
        const metaHook = RequestMeta.extend(meta, { isHook: true });
        const contextHook = {
            ...context,
            request: metaHook.request,
        };

        const actorKey = meta.data.reference.fActorKey as string;

        // Run a general hook
        await Step.run(actor.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'STEP_REQUEST_FAILED') as 'STEP_REQUEST_FAILED'] as StepInstance, actor, contextHook);

        const stepInstance = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.stepName)];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }

        await stepInstance.requestErrorHandler(context, StepApi.create(actor)(context));
    };
};
