"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.extend = exports.on = exports.create = void 0;
const tslib_1 = require("tslib");
const core__constants_1 = require("@usefelps/core--constants");
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const helper__logger_1 = tslib_1.__importDefault(require("@usefelps/helper--logger"));
// import Orchestrator from '@usefelps/core--orchestrator';
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__step_api_1 = tslib_1.__importDefault(require("@usefelps/core--step-api"));
const core__trail_1 = tslib_1.__importDefault(require("@usefelps/core--trail"));
const core__trail__data_requests_1 = tslib_1.__importDefault(require("@usefelps/core--trail--data-requests"));
const create = (options) => {
    const { name, crawlerOptions, handler, errorHandler, requestErrorHandler, afterHandler, beforeHandler, actorKey, } = options || {};
    return {
        ...core__instance_base_1.default.create({ key: 'step', name: name }),
        crawlerOptions,
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
    const logger = helper__logger_1.default.create(step);
    const ctx = core__request_meta_1.default.contextDefaulted(context);
    // Add actorKey to make sure we can identify the original actor when prefixed
    ctx.request.userData = core__request_meta_1.default.extend(core__request_meta_1.default.create(ctx.request), { reference: { [core__constants_1.ACTOR_KEY_PROP]: step.actorKey } }).userData;
    const stepApi = core__step_api_1.default.create(actor);
    const trail = core__trail_1.default.createFrom(ctx.request, { actor });
    const digest = core__trail_1.default.digested(trail);
    const meta = core__request_meta_1.default.create(ctx.request);
    if (!meta.data.isHook) {
        // CONDITIONALLY DISPLAY IT FOR HOOK AS WELL
        helper__logger_1.default.start(logger, context?.request?.url ? `at ${context.request.url}` : '');
    }
    try {
        await step?.beforeHandler?.(ctx, stepApi(ctx));
        await step?.handler?.(ctx, stepApi(ctx));
        core__trail__data_requests_1.default.setStatus(digest.requests, 'SUCCEEDED', meta.data.reference);
        await step?.afterHandler?.(ctx, stepApi(ctx));
    }
    catch (error) {
        core__trail__data_requests_1.default.setStatus(digest.requests, 'FAILED', meta.data.reference);
        throw error;
    }
    finally {
        // TODO: Better filter which hooks should fire the orchestrator
        // Can trigger a false push to dataset otherwise
        // && (!meta.data.isHook || !meta.data.stepName.includes('STEP_STARTED'))
        if (step?.handler) {
            // await Orchestrator.run(Orchestrator.create(actor), ctx, stepApi(ctx));
        }
        ;
    }
};
exports.run = run;
exports.default = { create: exports.create, on: exports.on, extend: exports.extend, run: exports.run };
//# sourceMappingURL=index.js.map