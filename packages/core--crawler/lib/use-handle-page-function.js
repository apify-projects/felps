"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const core__constants_1 = require("@usefelps/core--constants");
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__orchestrator_1 = tslib_1.__importDefault(require("@usefelps/core--orchestrator"));
const core__step_1 = tslib_1.__importDefault(require("@usefelps/core--step"));
const core__step_api_1 = tslib_1.__importDefault(require("@usefelps/core--step-api"));
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
        const step = actor.steps?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, meta.data.stepName)];
        if (!step) {
            return;
        }
        const stepApi = core__step_api_1.default.create(actor);
        if (meta.data.stepStop) {
            helper__logger_1.default.info(helper__logger_1.default.create(step), 'Step has been stopped');
            await core__orchestrator_1.default.run(core__orchestrator_1.default.create(actor), context, stepApi(context));
            // This step has been prohibited from running any further
            return;
        }
        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await core__step_1.default.run(actor.hooks?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, 'STEP_STARTED')], actor, contextHook);
        await core__step_1.default.run(step, actor, context);
        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await core__step_1.default.run(actor.hooks?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, 'STEP_ENDED')], actor, contextHook);
        await core__orchestrator_1.default.run(core__orchestrator_1.default.create(actor), context, stepApi(context));
    };
};
//# sourceMappingURL=use-handle-page-function.js.map