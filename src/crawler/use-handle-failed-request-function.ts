/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActorInstance, RequestContext } from '../common/types';
import step from '../step';
import requestMeta from '../request-meta';

export default (actor: ActorInstance) => {
    return async (crawlingContext: RequestContext) => {
        const meta = requestMeta.create(crawlingContext);

        // Run a general hook
        await step.run(actor.hooks.stepFailed, crawlingContext, {});

        const stepInstance = actor.steps?.[meta.data.step];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { crawlingContext });
            return;
        }

        // const api = new StepApi({ step: stepInstance, context }).make(crawlingContext);
        await stepInstance.errorHandler(crawlingContext, {});
    };
};
