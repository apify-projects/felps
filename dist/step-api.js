"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const step_api_flow_1 = tslib_1.__importDefault(require("./step-api-flow"));
const step_api_meta_1 = tslib_1.__importDefault(require("./step-api-meta"));
const step_api_model_1 = tslib_1.__importDefault(require("./step-api-model"));
const step_api_utils_1 = tslib_1.__importDefault(require("./step-api-utils"));
const create = (actor) => {
    return (context) => {
        const api = {
            ...step_api_flow_1.default.create(actor).handler(context),
            ...step_api_meta_1.default.create(actor).handler(context),
            ...step_api_utils_1.default.create().handler(context),
            ...step_api_model_1.default.create(actor).handler(context),
        };
        return api;
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=step-api.js.map