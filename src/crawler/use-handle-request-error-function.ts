/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActorInstance, RequestContext } from '../common/types';
import requestMeta from '../request-meta';
import step from '../step';

export default (actor: ActorInstance) => {
    return async (crawlingContext: RequestContext) => {
        const meta = requestMeta.create(crawlingContext);

        // Run a general hook
        await step.run(actor.hooks.stepRequestFailed, crawlingContext, {});

        const stepInstance = actor.steps?.[meta.data.stepName];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { crawlingContext });
            return;
        }

        // const api = new StepApi({ step: stepInstance, context }).make(crawlingContext);
        await stepInstance.requestErrorHandler(crawlingContext, {});
    };
};
