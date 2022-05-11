"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const trail_data_model_1 = tslib_1.__importDefault(require("./trail-data-model"));
// eslint-disable-next-line max-len
const create = (actor) => {
    return {
        ...base_1.default.create({ key: 'step-api-models', name: 'default' }),
        handler(context) {
            const trail = _1.Trail.createFrom(context?.request, { actor });
            const ingest = _1.Trail.ingested(trail);
            const meta = _1.RequestMeta.create(context?.request);
            const actorKey = meta.data.reference.fActorKey;
            const flow = meta.data.flowName ? actor.flows?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, meta.data.flowName)] : undefined;
            const getModelDetails = (stage) => (modelName, ref = {}, options) => {
                const { withOwnReferenceKey = false } = options || {};
                const modelInstance = _1.Trail.modelOfStage(stage, modelName);
                const reference = { ...meta.data.reference, ...ref };
                const modelRef = _1.Model.referenceFor(modelInstance.model, reference, withOwnReferenceKey);
                _1.Model.validateReference(modelInstance.model, modelRef, { throwError: true });
                return { modelInstance, modelRef };
            };
            const modelApi = {
                getInputModelName() {
                    return flow?.input?.name;
                },
                getOutputModelName() {
                    return flow?.output?.name;
                },
                get(modelName, ref) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName, ref, { withOwnReferenceKey: true });
                    return trail_data_model_1.default.get(modelInstance, modelRef);
                },
                set(modelName, value, ref) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName, ref);
                    _1.Model.validate(modelInstance.model, value, { throwError: true });
                    return trail_data_model_1.default.set(modelInstance, value, modelRef);
                },
                setPartial(modelName, value, ref) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName, ref);
                    _1.Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    return trail_data_model_1.default.setPartial(modelInstance, value, modelRef);
                },
                upsert(modelName, valueOrReducer, ref) {
                    const modelInstance = _1.Trail.modelOfStage(ingest, modelName);
                    const ownReferenceValue = _1.Model.referenceValue(modelInstance.model, ref);
                    if (ownReferenceValue && this.get(modelName, ref)) {
                        return this.update(modelName, valueOrReducer, ref);
                    }
                    ;
                    const value = typeof valueOrReducer === 'function' ? valueOrReducer({}) : valueOrReducer;
                    return this.set(modelName, value, ref);
                },
                upsertPartial(modelName, valueOrReducer, ref) {
                    const modelInstance = _1.Trail.modelOfStage(ingest, modelName);
                    const ownReferenceValue = _1.Model.referenceValue(modelInstance.model, ref);
                    if (ownReferenceValue && this.get(modelName, ref)) {
                        return this.updatePartial(modelName, valueOrReducer, ref);
                    }
                    ;
                    const value = typeof valueOrReducer === 'function' ? valueOrReducer({}) : valueOrReducer;
                    return this.setPartial(modelName, value, ref);
                },
                update(modelName, valueOrReducer, ref) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(trail_data_model_1.default.get(modelInstance, modelRef).data)
                        : valueOrReducer;
                    _1.Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    trail_data_model_1.default.update(modelInstance, value, modelRef);
                    return modelRef;
                },
                updatePartial(modelName, valueOrReducer, ref) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(trail_data_model_1.default.get(modelInstance, modelRef).data)
                        : valueOrReducer;
                    _1.Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    trail_data_model_1.default.updatePartial(modelInstance, value, modelRef);
                    return modelRef;
                },
            };
            return {
                ...modelApi,
                inFlow: () => modelApi,
            };
        },
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=step-api-model.js.map