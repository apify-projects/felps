"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__step_1 = tslib_1.__importDefault(require("@usefelps/core--step"));
const core__step_api_1 = tslib_1.__importDefault(require("@usefelps/core--step-api"));
const core__trail_1 = tslib_1.__importDefault(require("@usefelps/core--trail"));
const core__trail__data_requests_1 = tslib_1.__importDefault(require("@usefelps/core--trail--data-requests"));
const helper__logger_1 = tslib_1.__importDefault(require("@usefelps/helper--logger"));
exports.default = (actor) => {
    return async (context) => {
        const meta = core__request_meta_1.default.create(context);
        const metaHook = core__request_meta_1.default.extend(meta, { isHook: true });
        const contextHook = {
            ...context,
            request: metaHook.request,
        };
        const actorKey = meta.data.reference.fActorKey;
        const trail = core__trail_1.default.createFrom(context.request, { actor });
        const digest = core__trail_1.default.digested(trail);
        // Run a general hook
        await core__step_1.default.run(actor.hooks?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, 'STEP_FAILED')], actor, contextHook);
        const stepInstance = actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.stepName)];
        if (!stepInstance) {
            // context.log.error(`Step ${meta.data.step} not found.`, { RequestContext });
            return;
        }
        try {
            core__trail__data_requests_1.default.setStatus(digest.requests, 'DISCARDED', meta.data.reference);
            await stepInstance?.errorHandler?.(context, core__step_api_1.default.create(actor)(context));
        }
        catch (err) {
            helper__logger_1.default.error(helper__logger_1.default.create(stepInstance), `Error happened within step errorHandler: ${meta.data.stepName}`, { err });
        }
        ;
    };
};
//# sourceMappingURL=use-handle-failed-request-function.js.map