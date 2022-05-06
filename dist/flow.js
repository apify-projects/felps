"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.has = exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const create = (options) => {
    const { name, crawlerMode, steps = [], input, output, actorKey } = options || {};
    return {
        ...base_1.default.create({ key: 'flow', name }),
        crawlerMode,
        steps,
        input: _1.Model.create(input),
        output: _1.Model.create(output),
        actorKey,
    };
};
exports.create = create;
const has = (flow, stepName) => {
    return (flow.steps || []).some((name) => name === stepName);
};
exports.has = has;
exports.default = { create: exports.create, has: exports.has };
//# sourceMappingURL=flow.js.map