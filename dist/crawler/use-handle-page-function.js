"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const consts_1 = require("../consts");
const index_1 = require("../index");
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
        const step = actor.steps?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, meta.data.stepName)];
        if (meta.data.stepStop) {
            index_1.Logger.info(index_1.Logger.create(step), 'Step has been stopped');
            const stepApi = index_1.StepApi.create(actor);
            await index_1.Orchestrator.run(index_1.Orchestrator.create(actor), context, stepApi(context));
            // This step has been prohibited from running any further
            return;
        }
        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await index_1.Step.run(actor.hooks?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, 'STEP_STARTED')], actor, contextHook);
        await index_1.Step.run(step, actor, context);
        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await index_1.Step.run(actor.hooks?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, 'STEP_ENDED')], actor, contextHook);
    };
};
//# sourceMappingURL=use-handle-page-function.js.map