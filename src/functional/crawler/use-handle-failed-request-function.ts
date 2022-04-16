/* eslint-disable @typescript-eslint/no-explicit-any */
import { HOOK } from '../../common/consts';
import { RequestContext } from '../../common/types';
import requestMeta from '../request-meta';

export default (context: Context) => {
    return async (crawlingContext: RequestContext) => {
        const meta = requestMeta.create(crawlingContext);
        const { step } = meta.data;

        // Run a general hook
        await context.hooks?.[HOOK.STEP_REQUEST_FAILED].run?.(crawlingContext);

        const stepInstance = context.steps?.[meta.data.step];
        if (!stepInstance) {
            context.log.error(`Step ${step} not found.`, { crawlingContext });
            return;
        }

        const api = new StepApi({ step: stepInstance, context }).make(crawlingContext);
        await stepInstance.requestErrorHandler?.(crawlingContext, api);
    };
};
