"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const __1 = require("..");
const request_meta_1 = tslib_1.__importDefault(require("../request-meta"));
const step_1 = tslib_1.__importDefault(require("../step"));
exports.default = (actor) => {
    return async (RequestContext) => {
        const meta = request_meta_1.default.create(RequestContext);
        // Run a general hook
        await step_1.default.run(actor.hooks?.STEP_REQUEST_FAILED, actor, RequestContext);
        const stepInstance = actor.steps?.[meta.data.stepName];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }
        // const api = new StepApi({ step: stepInstance, context }).make(RequestContext);
        await stepInstance.requestErrorHandler(RequestContext, __1.StepApi.create(actor)(RequestContext));
    };
};
//# sourceMappingURL=use-handle-request-error-function.js.map