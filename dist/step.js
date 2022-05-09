"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.extend = exports.on = exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const trail_data_requests_1 = tslib_1.__importDefault(require("./trail-data-requests"));
const create = (options) => {
    const { name, crawlerMode, handler, errorHandler, requestErrorHandler, afterHandler, beforeHandler, actorKey, } = options || {};
    return {
        ...base_1.default.create({ key: 'step', name: name }),
        crawlerMode,
        handler,
        errorHandler,
        requestErrorHandler,
        afterHandler,
        beforeHandler,
        actorKey,
    };
};
exports.create = create;
const on = (step, handler) => {
    return {
        ...step,
        handler,
    };
};
exports.on = on;
const extend = (step, options) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...otherOptions } = options || {};
    return {
        ...step,
        ...otherOptions,
    };
};
exports.extend = extend;
const run = async (step, actor, context) => {
    if (!step)
        return;
    const logger = _1.Logger.create(step);
    const ctx = _1.RequestMeta.contextDefaulted(context);
    // Add actorKey to make sure we can identify the original actor when prefixed
    ctx.request.userData = _1.RequestMeta.extend(_1.RequestMeta.create(ctx.request), { reference: { [consts_1.ACTOR_KEY_PROP]: step.actorKey } }).userData;
    const stepApi = _1.StepApi.create(actor);
    const trail = _1.Trail.createFrom(ctx.request, { actor });
    const digest = _1.Trail.digested(trail);
    const meta = _1.RequestMeta.create(ctx.request);
    if (!meta.data.isHook) {
        // CONDITIONALLY DISPLAY IT FOR HOOK AS WELL
        _1.Logger.start(logger, context?.request?.url ? `at ${context.request.url}` : '');
    }
    try {
        await step?.beforeHandler?.(ctx, stepApi(ctx));
        await step?.handler?.(ctx, stepApi(ctx));
        trail_data_requests_1.default.setStatus(digest.requests, 'SUCCEEDED', meta.data.reference);
        await step?.afterHandler?.(ctx, stepApi(ctx));
    }
    catch (error) {
        console.error(error);
        await step?.errorHandler?.(ctx, stepApi(ctx));
        trail_data_requests_1.default.setStatus(digest.requests, 'FAILED', meta.data.reference);
    }
    finally {
        if (step?.handler) {
            await _1.Orchestrator.run(_1.Orchestrator.create(actor), ctx, stepApi(ctx));
        }
        ;
    }
};
exports.run = run;
exports.default = { create: exports.create, on: exports.on, extend: exports.extend, run: exports.run };
//# sourceMappingURL=step.js.map