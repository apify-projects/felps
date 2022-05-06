"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalHookNames = exports.create = void 0;
const tslib_1 = require("tslib");
const step_1 = tslib_1.__importDefault(require("./step"));
const create = (_) => {
    return {
        // global hooks
        ACTOR_STARTED: step_1.default.create({ name: 'ACTOR_STARTED' }),
        ACTOR_ENDED: step_1.default.create({ name: 'ACTOR_ENDED' }),
        QUEUE_STARTED: step_1.default.create({ name: 'QUEUE_STARTED' }),
        QUEUE_ENDED: step_1.default.create({ name: 'QUEUE_ENDED' }),
        // local hooks
        FLOW_STARTED: step_1.default.create({ name: 'FLOW_STARTED' }),
        FLOW_ENDED: step_1.default.create({ name: 'FLOW_ENDED' }),
        STEP_STARTED: step_1.default.create({ name: 'STEP_STARTED' }),
        STEP_ENDED: step_1.default.create({ name: 'STEP_ENDED' }),
        STEP_FAILED: step_1.default.create({ name: 'STEP_FAILED' }),
        STEP_REQUEST_FAILED: step_1.default.create({ name: 'STEP_REQUEST_FAILED' }),
    };
};
exports.create = create;
exports.globalHookNames = ['ACTOR_STARTED', 'ACTOR_ENDED', 'QUEUE_STARTED', 'QUEUE_ENDED'];
exports.default = { create: exports.create, globalHookNames: exports.globalHookNames };
//# sourceMappingURL=hooks.js.map