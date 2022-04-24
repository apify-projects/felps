/* eslint-disable @typescript-eslint/no-explicit-any */
import { StepApi } from '..';
import { ActorInstance, RequestContext, StepInstance } from '../types';
import requestMeta from '../request-meta';
import step from '../step';

export default (actor: ActorInstance) => {
    return async (crawlingContext: RequestContext) => {
        const meta = requestMeta.create(crawlingContext);

        // Run a general hook
        await step.run(actor.hooks?.STEP_REQUEST_FAILED as StepInstance, actor, crawlingContext);

        const stepInstance = actor.steps?.[meta.data.stepName as string];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { crawlingContext });
            return;
        }

        // const api = new StepApi({ step: stepInstance, context }).make(crawlingContext);
        await stepInstance.requestErrorHandler(crawlingContext, StepApi.create(actor)(crawlingContext));
    };
};
