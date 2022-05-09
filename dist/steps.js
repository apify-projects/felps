"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const step_1 = tslib_1.__importDefault(require("./step"));
const create = ({ STEPS }) => {
    return Object.keys(STEPS || {}).reduce((acc, name) => ({
        ...acc,
        [name]: step_1.default.create({ name, ...(STEPS[name] || {}) }),
    }), {});
};
exports.create = create;
const define = (steps) => {
    return steps;
};
exports.define = define;
const clone = (hooks) => {
    return Object.keys(hooks)
        .reduce((acc, name) => ({
        ...acc,
        [name]: _1.Step.create(hooks[name]),
    }), {});
};
exports.clone = clone;
exports.default = { create: exports.create, define: exports.define, clone: exports.clone };
//# sourceMappingURL=steps.js.map