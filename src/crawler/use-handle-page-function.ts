/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActorInstance, RequestContext } from '../common/types';
import requestMeta from '../request-meta';
import { Step, Dispatcher } from '../index';

export default (actor: ActorInstance) => {
    return async (crawlingContext: RequestContext) => {
        const meta = requestMeta.create(crawlingContext);

        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await Step.run(actor.hooks.STEP_STARTED, crawlingContext, {});

        await Step.run(actor.steps?.[meta.data.stepName], crawlingContext, {});

        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await Step.run(actor.hooks.STEP_ENDED, crawlingContext, {});

        const dispatcher = Dispatcher.create();
        await Dispatcher.run(dispatcher, crawlingContext);
    };
};
