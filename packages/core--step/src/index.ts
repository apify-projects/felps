import { ACTOR_KEY_PROP } from '@usefelps/core--constants';
import Base from '@usefelps/core--instance-base';
import Logger from '@usefelps/helper--logger';
// import Orchestrator from '@usefelps/core--orchestrator';
import RequestMeta from '@usefelps/core--request-meta';
import StepApi from '@usefelps/core--step-api';
import Trail from '@usefelps/core--trail';
import TrailDataRequests from '@usefelps/core--trail--data-requests';
import { ActorInstance, ReallyAny, RequestContext, StepInstance, StepOptions } from '@usefelps/types';

export const create = <Methods = unknown>(options?: StepOptions<Methods>): StepInstance<Methods> => {
    const {
        name,
        crawlerOptions,
        handler,
        errorHandler,
        requestErrorHandler,
        afterHandler,
        beforeHandler,
        actorKey,
    } = options || {};

    return {
        ...Base.create({ key: 'step', name: name as string }),
        crawlerOptions,
        handler,
        errorHandler,
        requestErrorHandler,
        afterHandler,
        beforeHandler,
        actorKey,
    };
};

export const on = (step: StepInstance, handler: () => void) => {
    return {
        ...step,
        handler,
    };
};

export const extend = <Methods = unknown>(step: StepInstance, options: StepOptions<Methods>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...otherOptions } = options || {};
    return {
        ...step,
        ...otherOptions,
    };
};

export const run = async (step: StepInstance | undefined, actor: ActorInstance, context: RequestContext | undefined): Promise<void> => {
    if (!step) return;

    const logger = Logger.create(step);

    const ctx = RequestMeta.contextDefaulted(context);
    // Add actorKey to make sure we can identify the original actor when prefixed
    ctx.request.userData = RequestMeta.extend(RequestMeta.create(ctx.request), { reference: { [ACTOR_KEY_PROP]: step.actorKey } }).userData;

    const stepApi = StepApi.create<ReallyAny, ReallyAny, ReallyAny, ReallyAny>(actor);

    const trail = Trail.createFrom(ctx.request, { actor });
    const digest = Trail.digested(trail);
    const meta = RequestMeta.create(ctx.request);

    if (!meta.data.isHook) {
        // CONDITIONALLY DISPLAY IT FOR HOOK AS WELL
        Logger.start(logger, context?.request?.url ? `at ${context.request.url}` : '');
    }

    try {
        await step?.beforeHandler?.(ctx, stepApi(ctx));

        await step?.handler?.(ctx, stepApi(ctx));
        TrailDataRequests.setStatus(digest.requests, 'SUCCEEDED', meta.data.reference);

        await step?.afterHandler?.(ctx, stepApi(ctx));
    } catch (error) {
        TrailDataRequests.setStatus(digest.requests, 'FAILED', meta.data.reference);
        throw error;
    } finally {
        // TODO: Better filter which hooks should fire the orchestrator
        // Can trigger a false push to dataset otherwise
        // && (!meta.data.isHook || !meta.data.stepName.includes('STEP_STARTED'))
        if (step?.handler) {
            // await Orchestrator.run(Orchestrator.create(actor), ctx, stepApi(ctx));
        };
    }
};

export default { create, on, extend, run };
