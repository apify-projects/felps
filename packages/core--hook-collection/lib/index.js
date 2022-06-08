"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.globalHookNames = exports.create = void 0;
const tslib_1 = require("tslib");
const core__step_1 = tslib_1.__importDefault(require("@usefelps/core--step"));
const create = (_) => {
    return {
        // global hooks
        ACTOR_STARTED: core__step_1.default.create({ name: 'ACTOR_STARTED' }),
        ACTOR_ENDED: core__step_1.default.create({ name: 'ACTOR_ENDED' }),
        QUEUE_STARTED: core__step_1.default.create({ name: 'QUEUE_STARTED' }),
        QUEUE_ENDED: core__step_1.default.create({ name: 'QUEUE_ENDED' }),
        // local hooks
        FLOW_STARTED: core__step_1.default.create({ name: 'FLOW_STARTED' }),
        FLOW_ENDED: core__step_1.default.create({ name: 'FLOW_ENDED' }),
        PRE_NAVIGATION: core__step_1.default.create({ name: 'PRE_NAVIGATION' }),
        STEP_STARTED: core__step_1.default.create({ name: 'STEP_STARTED' }),
        STEP_ENDED: core__step_1.default.create({ name: 'STEP_ENDED' }),
        STEP_FAILED: core__step_1.default.create({ name: 'STEP_FAILED' }),
        STEP_REQUEST_FAILED: core__step_1.default.create({ name: 'STEP_REQUEST_FAILED' }),
    };
};
exports.create = create;
exports.globalHookNames = ['ACTOR_STARTED', 'ACTOR_ENDED', 'QUEUE_STARTED', 'QUEUE_ENDED'];
const clone = (hooks) => {
    return Object.keys(hooks).reduce((acc, name) => ({ ...acc, [name]: core__step_1.default.create(hooks[name]) }), {});
};
exports.clone = clone;
exports.default = { create: exports.create, globalHookNames: exports.globalHookNames, clone: exports.clone };
//# sourceMappingURL=index.js.map