/* eslint-disable @typescript-eslint/no-explicit-any */
import { PREFIXED_NAME_BY_ACTOR } from '../consts';
import { Logger, Orchestrator, Step, StepApi } from '../index';
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

        const step = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.stepName)];

        if (meta.data.stepStop) {
            Logger.info(Logger.create(step), 'Step has been stopped');
            const stepApi = StepApi.create(actor);
            await Orchestrator.run(Orchestrator.create(actor), context, stepApi(context));
            // This step has been prohibited from running any further
            return;
        }

        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await Step.run(actor.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'STEP_STARTED') as 'STEP_STARTED'] as StepInstance, actor, contextHook);

        await Step.run(step, actor, context);

        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await Step.run(actor.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'STEP_ENDED') as 'STEP_ENDED'] as StepInstance, actor, contextHook);
    };
};
