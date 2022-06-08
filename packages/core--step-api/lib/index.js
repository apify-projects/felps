"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const core__step_api__flow_1 = tslib_1.__importDefault(require("@usefelps/core--step-api--flow"));
const core__step_api__meta_1 = tslib_1.__importDefault(require("@usefelps/core--step-api--meta"));
const core__step_api__model_1 = tslib_1.__importDefault(require("@usefelps/core--step-api--model"));
const core__step_api__helpers_1 = tslib_1.__importDefault(require("@usefelps/core--step-api--helpers"));
const create = (actor) => {
    return (context) => {
        const api = {
            ...core__step_api__flow_1.default.create(actor).handler(context),
            ...core__step_api__meta_1.default.create(actor).handler(context),
            ...core__step_api__model_1.default.create(actor).handler(context),
            ...core__step_api__helpers_1.default.create().handler(context),
        };
        return api;
        // return {
        //     ...api,
        //     // ...(options?.extend?.(context, api, actor) || {}),
        // };
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=index.js.map