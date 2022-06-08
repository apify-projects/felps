"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const core__constants_1 = require("@usefelps/core--constants");
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__orchestrator_1 = tslib_1.__importDefault(require("@usefelps/core--orchestrator"));
const core__step_1 = tslib_1.__importDefault(require("@usefelps/core--step"));
const core__step_api_1 = tslib_1.__importDefault(require("@usefelps/core--step-api"));
exports.default = (actor) => {
    return async (context) => {
        const meta = core__request_meta_1.default.create(context);
        const metaHook = core__request_meta_1.default.extend(meta, { isHook: true });
        const contextHook = {
            ...context,
            request: metaHook.request,
        };
        const actorKey = meta.data.reference.fActorKey;
        // Run a general hook
        await core__step_1.default.run(actor.hooks?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, 'STEP_REQUEST_FAILED')], actor, contextHook);
        const stepInstance = actor.steps?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, meta.data.stepName)];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }
        await stepInstance?.requestErrorHandler?.(context, core__step_api_1.default.create(actor)(context));
        if (stepInstance?.handler) {
            await core__orchestrator_1.default.run(core__orchestrator_1.default.create(actor), context, core__step_api_1.default.create(actor)(context));
        }
        ;
    };
};
//# sourceMappingURL=use-handle-request-error-function.js.map