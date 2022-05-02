"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../index");
const request_meta_1 = tslib_1.__importDefault(require("../request-meta"));
exports.default = (actor) => {
    return async (context) => {
        const meta = request_meta_1.default.create(context);
        // Before each route Hook can be used for logging, anti-bot detection, catpatcha, etc.
        await index_1.Step.run(actor.hooks?.STEP_STARTED, actor, context);
        await index_1.Step.run(actor.steps?.[meta.data.stepName], actor, context);
        // After each route Hook can be used for checking up data this would have been made ready to push to the dataset in KV.
        await index_1.Step.run(actor.hooks?.STEP_ENDED, actor, context);
    };
};
//# sourceMappingURL=use-handle-page-function.js.map