import { Logger, Orchestrator, RequestMeta, StepApi } from '.';
import base from './base';
import { ActorInstance, RequestContext, StepInstance, StepOptions } from './common/types';

export const create = <Methods = unknown>(options?: StepOptions<Methods>): StepInstance<Methods> => {
    const {
        name,
        crawlerMode,
        handler,
        errorHandler,
        requestErrorHandler,
    } = options || {};

    return {
        ...base.create({ key: 'step', name }),
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

export const run = async (step: StepInstance, actor: ActorInstance, context: RequestContext): Promise<void> => {
    Logger.start(Logger.create(step), context?.request?.url ? `at ${context.request.url}` : null);
    const ctx = RequestMeta.contextDefaulted(context);

    const stepApi = StepApi.create(actor);

    try {
        await step?.handler?.(ctx, stepApi(ctx));
    } catch (error) {
        await step?.errorHandler?.(ctx, stepApi(ctx));
    } finally {
        if (step?.handler) {
            await Orchestrator.run(Orchestrator.create(actor), ctx, stepApi(ctx));
        }
    }
};

export default { create, on, extend, run };
