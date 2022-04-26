import { Logger, Orchestrator, RequestMeta, StepApi, Trail } from '.';
import base from './base';
import { ActorInstance, reallyAny, RequestContext, StepInstance, StepOptions } from './types';
import TrailDataRequests from './trail-data-requests';

export const create = <Methods = unknown>(options?: StepOptions<Methods>): StepInstance<Methods> => {
    const {
        name,
        crawlerMode,
        handler,
        errorHandler,
        requestErrorHandler,
    } = options || {};

    return {
        ...base.create({ key: 'step', name: name as string }),
        crawlerMode,
        handler,
        errorHandler,
        requestErrorHandler,
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
    if (!step) {
        return;
    }
    const logger = Logger.create(step);

    Logger.start(logger, context?.request?.url ? `at ${context.request.url}` : '');
    const ctx = RequestMeta.contextDefaulted(context);

    const stepApi = StepApi.create<reallyAny, reallyAny, reallyAny>(actor);

    const trail = Trail.createFrom(ctx.request, { actor });
    const digest = Trail.digested(trail);
    const meta = RequestMeta.create(ctx.request);

    try {
        await step?.handler?.(ctx, stepApi(ctx));
        TrailDataRequests.setStatus(digest.requests, 'SUCCEEDED', meta.data.reference);
    } catch (error) {
        console.error(error);
        // Logger.error(logger, error as string);
        await step?.errorHandler?.(ctx, stepApi(ctx));
        TrailDataRequests.setStatus(digest.requests, 'FAILED', meta.data.reference);
    } finally {
        if (step?.handler) {
            await Orchestrator.run(Orchestrator.create(actor), ctx, stepApi(ctx));
        }
    }
};

export default { create, on, extend, run };
