import { Model, RequestMeta, Trail } from '.';
import base from './base';
import { PREFIXED_NAME_BY_ACTOR } from './consts';
import TrailDataModel from './trail-data-model';
import {
    ActorInstance, FlowInstance, ModelDefinition, ModelReference,
    ReallyAny, StepApiModelAPI, StepApiModelInstance, TrailDataModelInstance,
} from './types';

// eslint-disable-next-line max-len
export const create = <M extends Record<string, ModelDefinition>>(actor: ActorInstance): StepApiModelInstance<M> => {
    return {
        ...base.create({ key: 'step-api-models', name: 'default' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);

            const meta = RequestMeta.create(context?.request);
            const actorKey = meta.data.reference.fActorKey as string;
            const flow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny>;
            // const flow = meta.data.flowName ? actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny> : undefined;

            // (stage: TrailDataStage) =>
            const getModelDetails = (
                modelName: string,
                ref: ModelReference = {},
                options?: { withOwnReferenceKey?: boolean },
            ): { modelInstance: TrailDataModelInstance, modelRef: ModelReference } => {
                const { withOwnReferenceKey = false } = options || {};
                const modelInstance = Trail.modelOfStage(ingest, modelName);
                // CHECK IF MODEL EXISTS
                // const model = Model.dependency(flow.output, modelName) as ModelInstance<ReallyAny>;
                const reference = { ...meta.data.reference, ...ref };
                // const modelRef = Model.referenceFor(model, reference, withOwnReferenceKey);
                // Model.validateReference(model, modelRef, { throwError: true });
                // return { modelInstance: { ...modelInstance, model }, modelRef };
                const modelRef = Model.referenceFor(modelInstance.model, reference, withOwnReferenceKey);
                Model.validateReference(modelInstance.model, modelRef, { throwError: true });
                return { modelInstance, modelRef };
            };

            const modelApi = {
                getInputModelName() {
                    return flow?.input?.name;
                },
                getOutputModelName() {
                    return flow?.output?.name;
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
                    return TrailDataModel.set(modelInstance, value as ReallyAny, modelRef) as ModelReference<ReallyAny>;
                },
                setPartial(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref);
                    Model.validate(modelInstance.model, value || {}, { partial: true, throwError: true });
                    // TODO: better handle references tree
                    // return TrailDataModel.setPartial(modelInstance, value as ReallyAny, { ...modelRef, ...ref }) as ModelReference<ReallyAny>;
                    return TrailDataModel.setPartial(modelInstance, (value || {}) as ReallyAny, modelRef) as ModelReference<ReallyAny>;
                },
                upsert(modelName, valueOrReducer, ref?) {
                    const modelInstance = Trail.modelOfStage(ingest, modelName);
                    const ownReferenceValue = Model.referenceValue(modelInstance.model, ref as ModelReference<ReallyAny>);
                    if (ownReferenceValue && this.get(modelName, ref)) {
                        return this.update(modelName, valueOrReducer, ref);
                    };
                    const value = typeof valueOrReducer === 'function' ? valueOrReducer({}) : valueOrReducer;
                    return this.set(modelName, value as ReallyAny, ref);
                },
                upsertPartial(modelName, valueOrReducer, ref?) {
                    const modelInstance = Trail.modelOfStage(ingest, modelName);
                    const ownReferenceValue = Model.referenceValue(modelInstance.model, ref as ModelReference<ReallyAny>);
                    if (ownReferenceValue && this.get(modelName, ref)) {
                        return this.updatePartial(modelName, valueOrReducer || {} as ReallyAny, ref);
                    };
                    const value = typeof valueOrReducer === 'function' ? valueOrReducer({}) : valueOrReducer;
                    return this.setPartial(modelName, value as ReallyAny, ref);
                },
                update(modelName, valueOrReducer, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(TrailDataModel.get(modelInstance, modelRef).data as ReallyAny)
                        : valueOrReducer;
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    TrailDataModel.update<ReallyAny>(modelInstance, value, modelRef as ReallyAny);
                    return modelRef as ModelReference<ReallyAny>;
                },
                updatePartial(modelName, valueOrReducer, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(TrailDataModel.get(modelInstance, modelRef).data as ReallyAny)
                        : valueOrReducer;
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    TrailDataModel.updatePartial<ReallyAny>(modelInstance, value, modelRef as ReallyAny);
                    return modelRef as ModelReference<ReallyAny>;
                },
            } as Omit<StepApiModelAPI<M>, 'inFlow'>;

            return {
                ...modelApi,
                inFlow: () => modelApi as ReallyAny,
            } as StepApiModelAPI<M>;
        },
    };
};

export default { create };
