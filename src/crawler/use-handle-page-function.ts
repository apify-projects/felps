/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActorInstance, RequestContext, StepInstance } from '../types';
import { Step } from '../index';
import RequestMeta from '../request-meta';

export default (actor: ActorInstance) => {
    return async (context: RequestContext) => {
        const meta = RequestMeta.create(context);

        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await Step.run(actor.hooks?.STEP_STARTED as StepInstance, actor, context);

        await Step.run(actor.steps?.[meta.data.stepName as string] as StepInstance, actor, context);

        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await Step.run(actor.hooks?.STEP_ENDED as StepInstance, actor, context);
    };
};
