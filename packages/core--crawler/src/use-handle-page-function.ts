/* eslint-disable @typescript-eslint/no-explicit-any */
import { PREFIXED_NAME_BY_ACTOR } from '@usefelps/constants';
import RequestMeta from '@usefelps/core--request-meta';
import Orchestrator from '@usefelps/core--orchestrator';
import Step from '@usefelps/core--step';
import StepApi from '@usefelps/core--step-api';
import Logger from '@usefelps/helper--logger';
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

        const step = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.stepName)];

        if (!step) {
            return;
        }

        const stepApi = StepApi.create<FT.ReallyAny, FT.ReallyAny, FT.ReallyAny, FT.ReallyAny>(actor);

        if (meta.data.stepStop) {
            Logger.info(Logger.create(step), 'Step has been stopped');
            await Orchestrator.run(Orchestrator.create(actor), context, stepApi(context));
            // This step has been prohibited from running any further
            return;
        }

        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await Step.run(actor.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'STEP_STARTED') as 'STEP_STARTED'] as FT.StepInstance, actor, contextHook);

        await Step.run(step, actor, context);

        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await Step.run(actor.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'STEP_ENDED') as 'STEP_ENDED'] as FT.StepInstance, actor, contextHook);

        await Orchestrator.run(Orchestrator.create(actor), context, stepApi(context));

    };
};
