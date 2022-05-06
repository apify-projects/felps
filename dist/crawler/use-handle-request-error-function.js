"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const __1 = require("..");
const consts_1 = require("../consts");
const request_meta_1 = tslib_1.__importDefault(require("../request-meta"));
exports.default = (actor) => {
    return async (context) => {
        const meta = request_meta_1.default.create(context);
        const metaHook = request_meta_1.default.extend(meta, { isHook: true });
        const contextHook = {
            ...context,
            request: metaHook.request,
        };
        const actorKey = meta.data.reference.fActorKey;
        // Run a general hook
        await __1.Step.run(actor.hooks?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, 'STEP_REQUEST_FAILED')], actor, contextHook);
        const stepInstance = actor.steps?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, meta.data.stepName)];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }
        await stepInstance.requestErrorHandler(context, __1.StepApi.create(actor)(context));
    };
};
//# sourceMappingURL=use-handle-request-error-function.js.map