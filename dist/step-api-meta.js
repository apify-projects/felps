"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const request_meta_1 = tslib_1.__importDefault(require("./request-meta"));
const create = (actor) => {
    return {
        ...base_1.default.create({ key: 'step-api-meta', name: 'step-api-meta' }),
        handler(context) {
            const trail = _1.Trail.createFrom(context?.request, { actor });
            const meta = request_meta_1.default.create(context);
            return {
                getActorInput: () => actor.input.data,
                getUserData: () => meta.userData,
                getMetaData: () => meta.data,
                getReference: () => meta.data.reference,
                getFlowName: () => meta.data.flowName,
                getStepName: () => meta.data.stepName,
                getFlowInput: () => {
                    return _1.Trail.getFlow(trail, meta.data?.reference?.[consts_1.FLOW_KEY_PROP])?.input || {};
                },
            };
        },
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=step-api-meta.js.map