/* eslint-disable @typescript-eslint/no-explicit-any */
import { StepApi } from '..';
import { ActorInstance, RequestContext, StepInstance } from '../types';
import requestMeta from '../request-meta';
import step from '../step';

export default (actor: ActorInstance) => {
    return async (RequestContext: RequestContext) => {
        const meta = requestMeta.create(RequestContext);

        // Run a general hook
        await step.run(actor.hooks?.STEP_REQUEST_FAILED as StepInstance, actor, RequestContext);

        const stepInstance = actor.steps?.[meta.data.stepName as string];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }

        // const api = new StepApi({ step: stepInstance, context }).make(RequestContext);
        await stepInstance.requestErrorHandler(RequestContext, StepApi.create(actor)(RequestContext));
    };
};
