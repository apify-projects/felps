"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.has = exports.create = void 0;
const tslib_1 = require("tslib");
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__model_1 = tslib_1.__importDefault(require("@usefelps/core--model"));
const create = (options) => {
    const { name, crawlerOptions, steps = [], flows = [], input, output, actorKey } = options || {};
    return {
        ...core__instance_base_1.default.create({ key: 'flow', name }),
        crawlerOptions,
        steps,
        flows,
        input: core__model_1.default.create(input),
        output: core__model_1.default.create(output),
        actorKey,
    };
};
exports.create = create;
const has = (flow, stepName) => {
    return (flow.steps || []).some((name) => CONST.UNPREFIXED_NAME_BY_ACTOR(name) === CONST.UNPREFIXED_NAME_BY_ACTOR(stepName));
};
exports.has = has;
exports.default = { create: exports.create, has: exports.has };
//# sourceMappingURL=index.js.map