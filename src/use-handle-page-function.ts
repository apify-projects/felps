/* eslint-disable @typescript-eslint/no-explicit-any */
import { HOOK } from './common/consts';
import { RequestContext } from './common/types';

export default (context: Context) => {
    return async (crawlingContext: RequestContext) => {
        const { step } = crawlingContext.request?.userData || {};

        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await context.hooks?.[HOOK.STEP_STARTED].run?.(crawlingContext);

        await context.steps?.[step].run?.(crawlingContext);

        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await context.hooks?.[HOOK.STEP_ENDED].run?.(crawlingContext);
    };
};
