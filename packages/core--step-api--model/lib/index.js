"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__model_1 = tslib_1.__importDefault(require("@usefelps/core--model"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__trail_1 = tslib_1.__importDefault(require("@usefelps/core--trail"));
const core__trail__data_model_1 = tslib_1.__importDefault(require("@usefelps/core--trail--data-model"));
// eslint-disable-next-line max-len
const create = (actor) => {
    return {
        ...core__instance_base_1.default.create({ key: 'step-api-model', name: 'default' }),
        handler(context) {
            const trail = core__trail_1.default.createFrom(context?.request, { actor });
            const ingest = core__trail_1.default.ingested(trail);
            const meta = core__request_meta_1.default.create(context?.request);
            const actorKey = meta.data.reference.fActorKey;
            // const flow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny>;
            const mainFlowName = core__trail_1.default.getMainFlow(trail)?.name || '';
            const mainFlow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, mainFlowName)];
            // const currentFlow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny>;
            const getModelDetails = (modelName, ref = {}, options) => {
                const { withOwnReferenceKey = false } = options || {};
                const modelInstance = { ...core__trail_1.default.modelOfStage(ingest, modelName) };
                const { model } = modelInstance;
                modelInstance.model = core__model_1.default.dependency(mainFlow.output, modelName) || modelInstance.model;
                // CHECK IF MODEL EXISTS
                // const model = (Model.dependency(mainFlow?.output, modelName) ||
                // Model.dependency(currentFlow?.output, modelName)) as ModelInstance<ReallyAny>;
                const reference = { ...meta.data.reference, ...ref };
                // console.log('model', modelName, model)
                // const modelRef = Model.referenceFor(model, reference, withOwnReferenceKey);
                // console.log('modelRef', modelName, modelRef, reference)
                // Model.validateReference(model, modelRef, { throwError: true });
                // Pass on full reference instead of hand picked one
                // return { modelInstance: { ...modelInstance, model }, modelRef: reference };
                const modelRef = core__model_1.default.referenceFor(model, reference, { withOwnReferenceKey });
                core__model_1.default.validateReference(model, modelRef, { throwError: true });
                return { modelInstance, modelRef: reference };
            };
            const modelApi = {
                getInputModelName() {
                    return mainFlow?.input?.name;
                },
                getOutputModelName() {
                    return mainFlow?.output?.name;
                },
                get(modelName, ref) {
                    const { modelInstance, modelRef } = getModelDetails(modelName, ref, { withOwnReferenceKey: true });
                    return core__trail__data_model_1.default.get(modelInstance, modelRef);
                },
                set(modelName, value, ref) {
                    const { modelInstance, modelRef } = getModelDetails(modelName, ref);
                    core__model_1.default.validate(modelInstance.model, value, { throwError: true });
                    // TODO: better handle references tree
                    // return TrailDataModel.set(modelInstance, value as ReallyAny, { ...modelRef, ...ref }) as ModelReference<ReallyAny>;
                    return core__trail__data_model_1.default.set(modelInstance, value, modelRef);
                },
                setPartial(modelName, value, ref) {
                    const { modelInstance, modelRef } = getModelDetails(modelName, ref);
                    core__model_1.default.validate(modelInstance.model, value || {}, { partial: true, throwError: true });
                    // TODO: better handle references tree
                    // return TrailDataModel.setPartial(modelInstance, value as ReallyAny, { ...modelRef, ...ref }) as ModelReference<ReallyAny>;
                    return core__trail__data_model_1.default.setPartial(modelInstance, (value || {}), modelRef);
                },
                upsert(modelName, valueOrReducer, ref) {
                    const modelInstance = core__trail_1.default.modelOfStage(ingest, modelName);
                    const ownReferenceValue = core__model_1.default.referenceValue(modelInstance.model, ref);
                    if (ownReferenceValue && this.get(modelName, ref)) {
                        return this.update(modelName, valueOrReducer, ref);
                    }
                    ;
                    const value = typeof valueOrReducer === 'function' ? valueOrReducer({}) : valueOrReducer;
                    return this.set(modelName, value, ref);
                },
                upsertPartial(modelName, valueOrReducer, ref) {
                    const modelInstance = core__trail_1.default.modelOfStage(ingest, modelName);
                    const ownReferenceValue = core__model_1.default.referenceValue(modelInstance.model, ref);
                    if (ownReferenceValue && this.get(modelName, ref)) {
                        return this.updatePartial(modelName, valueOrReducer || {}, ref);
                    }
                    ;
                    const value = typeof valueOrReducer === 'function' ? valueOrReducer({}) : valueOrReducer;
                    return this.setPartial(modelName, value, ref);
                },
                update(modelName, valueOrReducer, ref) {
                    const { modelInstance, modelRef } = getModelDetails(modelName, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(core__trail__data_model_1.default.get(modelInstance, modelRef).data)
                        : valueOrReducer;
                    core__model_1.default.validate(modelInstance.model, value, { partial: true, throwError: true });
                    core__trail__data_model_1.default.update(modelInstance, value, modelRef);
                    return modelRef;
                },
                updatePartial(modelName, valueOrReducer, ref) {
                    const { modelInstance, modelRef } = getModelDetails(modelName, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(core__trail__data_model_1.default.get(modelInstance, modelRef).data)
                        : valueOrReducer;
                    core__model_1.default.validate(modelInstance.model, value, { partial: true, throwError: true });
                    core__trail__data_model_1.default.updatePartial(modelInstance, value, modelRef);
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
//# sourceMappingURL=index.js.map