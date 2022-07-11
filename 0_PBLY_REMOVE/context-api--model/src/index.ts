import * as CONST from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import Model from '@usefelps/model';
import RequestMeta from '@usefelps/request-meta';
import Trail from '@usefelps/trail';
import TrailDataModel from '@usefelps/trail--data-model';
import * as FT from '@usefelps/types';

// eslint-disable-next-line max-len
export const create = <M extends Record<string, FT.ModelDefinition>>(actor: FT.ActorInstance): FT.TContextApiModelInstance<M> => {
    return {
        ...Base.create({ key: 'context-api-model', name: 'default' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);

            const meta = RequestMeta.create(context?.request);
            const actorKey = meta.data.reference.fActorKey as string;
            // const flow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny>;
            const mainFlowName = Trail.getMainFlow(trail)?.name || '';
            const mainFlow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, mainFlowName)];

            // const currentFlow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny>;

            const getModelDetails = (
                modelName: string,
                ref: FT.ModelReference = {},
                options?: { withOwnReferenceKey?: boolean },
            ): { modelInstance: FT.TrailDataModelInstance, modelRef: FT.ModelReference } => {
                const { withOwnReferenceKey = false } = options || {};
                const modelInstance = { ...Trail.modelOfStage(ingest, modelName) };
                const { model } = modelInstance
                modelInstance.model = Model.dependency(mainFlow.output, modelName) || modelInstance.model;
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
                const modelRef = Model.referenceFor(model, reference, { withOwnReferenceKey });
                Model.validateReference(model, modelRef, { throwError: true });
                return { modelInstance, modelRef: reference };
            };

            const modelApi = {
                getInputModelName() {
                    return mainFlow?.input?.name;
                },
                getOutputModelName() {
                    return mainFlow?.output?.name;
                },
                get(modelName, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    return TrailDataModel.get(modelInstance, modelRef);
                },
                set(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref);
                    Model.validate(modelInstance.model, value, { throwError: true });
                    // TODO: better handle references tree
                    // return TrailDataModel.set(modelInstance, value as ReallyAny, { ...modelRef, ...ref }) as ModelReference<ReallyAny>;
                    return TrailDataModel.set(modelInstance, value as FT.ReallyAny, modelRef) as FT.ModelReference<FT.ReallyAny>;
                },
                setPartial(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref);
                    Model.validate(modelInstance.model, value || {}, { partial: true, throwError: true });
                    // TODO: better handle references tree
                    // return TrailDataModel.setPartial(modelInstance, value as ReallyAny, { ...modelRef, ...ref }) as ModelReference<ReallyAny>;
                    return TrailDataModel.setPartial(modelInstance, (value || {}) as FT.ReallyAny, modelRef) as FT.ModelReference<FT.ReallyAny>;
                },
                upsert(modelName, valueOrReducer, ref?) {
                    const modelInstance = Trail.modelOfStage(ingest, modelName);
                    const ownReferenceValue = Model.referenceValue(modelInstance.model, ref as FT.ModelReference<FT.ReallyAny>);
                    if (ownReferenceValue && this.get(modelName, ref)) {
                        return this.update(modelName, valueOrReducer, ref);
                    };
                    const value = typeof valueOrReducer === 'function' ? valueOrReducer({}) : valueOrReducer;
                    return this.set(modelName, value as FT.ReallyAny, ref);
                },
                upsertPartial(modelName, valueOrReducer, ref?) {
                    const modelInstance = Trail.modelOfStage(ingest, modelName);
                    const ownReferenceValue = Model.referenceValue(modelInstance.model, ref as FT.ModelReference<FT.ReallyAny>);
                    if (ownReferenceValue && this.get(modelName, ref)) {
                        return this.updatePartial(modelName, valueOrReducer || {} as FT.ReallyAny, ref);
                    };
                    const value = typeof valueOrReducer === 'function' ? valueOrReducer({}) : valueOrReducer;
                    return this.setPartial(modelName, value as FT.ReallyAny, ref);
                },
                update(modelName, valueOrReducer, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(TrailDataModel.get(modelInstance, modelRef).data as FT.ReallyAny)
                        : valueOrReducer;
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    TrailDataModel.update<FT.ReallyAny>(modelInstance, value, modelRef as FT.ReallyAny);
                    return modelRef as FT.ModelReference<FT.ReallyAny>;
                },
                updatePartial(modelName, valueOrReducer, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(TrailDataModel.get(modelInstance, modelRef).data as FT.ReallyAny)
                        : valueOrReducer;
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    TrailDataModel.updatePartial<FT.ReallyAny>(modelInstance, value, modelRef as FT.ReallyAny);
                    return modelRef as FT.ModelReference<FT.ReallyAny>;
                },
            } as FT.TContextApiModelByFlowAPI<M>;

            return {
                ...modelApi,
                inFlow: () => modelApi as FT.ReallyAny,
            } as unknown as FT.TContextApiModelAPI<M>;
        },
    };
};

export default { create };
