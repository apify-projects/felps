"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const step_1 = tslib_1.__importDefault(require("../step"));
const request_meta_1 = tslib_1.__importDefault(require("../request-meta"));
const __1 = require("..");
exports.default = (actor) => {
    return async (context) => {
        const meta = request_meta_1.default.create(context);
        // Run a general hook
        await step_1.default.run(actor.hooks?.STEP_FAILED, actor, context);
        const stepInstance = actor.steps?.[meta.data.stepName];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }
        // const api = new StepApi({ step: stepInstance, context }).make(RequestContext);
        await stepInstance?.errorHandler?.(context, __1.StepApi.create(actor)(context));
    };
};
//# sourceMappingURL=use-handle-failed-request-function.js.map