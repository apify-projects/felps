"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
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
exports.default = { create: exports.create, define: exports.define };
//# sourceMappingURL=steps.js.map