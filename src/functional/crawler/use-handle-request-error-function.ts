/* eslint-disable @typescript-eslint/no-explicit-any */
import { HOOK } from '../../common/consts';
import { RequestContext } from '../../common/types';
import Actor from '../../actor';

export default (actor: Actor) => {
    return async (crawlingContext: RequestContext) => {
        const { step } = crawlingContext.request?.userData || {};

        // Run a general hook
        await actor.hooks?.[HOOK.STEP_FAILED].run?.(crawlingContext);

        const stepInstance = actor.steps?.[step];
        if (!stepInstance) {
            actor.log.error(`Step ${step} not found.`, { crawlingContext });
            return;
        }

        const api = new StepApi({ step: stepInstance, actor }).make(crawlingContext);
        await stepInstance.failHandler?.(crawlingContext, api);
    };
};
