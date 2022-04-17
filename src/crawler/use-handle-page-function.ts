/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActorInstance, RequestContext } from '../common/types';
import requestMeta from '../request-meta';
import step from '../step';

export default (actor: ActorInstance) => {
    return async (crawlingContext: RequestContext) => {
        const meta = requestMeta.create(crawlingContext);

        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await step.run(actor.hooks.stepStarted, crawlingContext, {});

        await step.run(actor.steps?.[meta.data.step], crawlingContext, {});

        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await step.run(actor.hooks.stepEnded, crawlingContext, {});
    };
};
