/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActorInstance, RequestContext, StepInstance } from '../types';
import step from '../step';
import requestMeta from '../request-meta';
import { StepApi } from '..';

export default (actor: ActorInstance) => {
    return async (context: RequestContext) => {
        const meta = requestMeta.create(context);

        // Run a general hook
        await step.run(actor.hooks?.STEP_FAILED as StepInstance, actor, context);

        const stepInstance = actor.steps?.[meta.data.stepName as string];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }

        // const api = new StepApi({ step: stepInstance, context }).make(RequestContext);
        await stepInstance?.errorHandler?.(context, StepApi.create(actor)(context));
    };
};
