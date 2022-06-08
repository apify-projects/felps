"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const core__constants_1 = require("@usefelps/core--constants");
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__trail_1 = tslib_1.__importDefault(require("@usefelps/core--trail"));
const create = (actor) => {
    return {
        ...core__instance_base_1.default.create({ key: 'step-api-meta', name: 'step-api-meta' }),
        handler(context) {
            const trail = core__trail_1.default.createFrom(context?.request, { actor });
            const meta = core__request_meta_1.default.create(context);
            return {
                getActorName: () => meta.data.reference.fActorKey,
                getActorInput: () => actor.input.data || {},
                getUserData: () => meta.userData || {},
                getMetaData: () => meta.data || {},
                getReference: () => meta.data.reference || {},
                getFlowName: () => meta.data.flowName,
                getStepName: () => meta.data.stepName,
                getFlowInput: () => {
                    return core__trail_1.default.getFlow(trail, meta.data?.reference?.[core__constants_1.FLOW_KEY_PROP])?.input || {};
                },
            };
        },
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=index.js.map