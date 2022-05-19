import { Logger, Orchestrator, RequestMeta, StepApi, Trail } from '.';
import base from './base';
import { ACTOR_KEY_PROP } from './consts';
import TrailDataRequests from './trail-data-requests';
import { ActorInstance, ReallyAny, RequestContext, StepInstance, StepOptions } from './types';

export const create = <Methods = unknown>(options?: StepOptions<Methods>): StepInstance<Methods> => {
    const {
        name,
        crawlerMode,
        handler,
        errorHandler,
        requestErrorHandler,
        afterHandler,
        beforeHandler,
        actorKey,
    } = options || {};

    return {
        ...base.create({ key: 'step', name: name as string }),
        crawlerMode,
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
        if (step?.handler) {
            await Orchestrator.run(Orchestrator.create(actor), ctx, stepApi(ctx));
        };
    }
};

export default { create, on, extend, run };
