import { Model, RequestMeta, Trail } from '.';
import base from './base';
import TrailDataModel from './trail-data-model';
import { ActorInstance, ModelDefinition, ModelReference, ReallyAny, StepApiModelAPI, StepApiModelInstance, TrailDataStage } from './types';

// eslint-disable-next-line max-len
export const create = <M extends Record<string, ModelDefinition>>(actor: ActorInstance): StepApiModelInstance<M> => {
    return {
        ...base.create({ key: 'step-api-models', name: 'default' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);

            const meta = RequestMeta.create(context?.request);

            const getModelDetails = (stage: TrailDataStage) => (modelName: string, ref: ModelReference = {}, options?: { withOwnReferenceKey?: boolean }) => {
                const { withOwnReferenceKey = false } = options || {};
                const modelInstance = stage.models?.[modelName];
                const reference = { ...meta.data.reference, ...ref };
                const modelRef = Model.referenceFor(modelInstance.model, reference, withOwnReferenceKey);
                Model.validateReference(modelInstance.model, modelRef, { throwError: true });
                return { modelInstance, modelRef };
            };

            return {
                add(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName as string, ref);
                    Model.validate(modelInstance.model, value, { throwError: true });
                    return TrailDataModel.set(modelInstance, value as ReallyAny, modelRef) as ModelReference<ReallyAny>;
                },
                addPartial(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName as string, ref);
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    return TrailDataModel.setPartial(modelInstance, value as ReallyAny, modelRef) as ModelReference<ReallyAny>;
                },
                get(modelName, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName as string, ref, { withOwnReferenceKey: true });
                    return TrailDataModel.get(modelInstance, modelRef);
                },
                update(modelName, valueOrReducer, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName as string, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(TrailDataModel.get(modelInstance, modelRef).data as ReallyAny)
                        : valueOrReducer;
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    TrailDataModel.update<ReallyAny>(modelInstance, value, modelRef as ReallyAny);
                    return modelRef as ModelReference<ReallyAny>;
                },
                updatePartial(modelName, valueOrReducer, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName as string, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(TrailDataModel.get(modelInstance, modelRef).data as ReallyAny)
                        : valueOrReducer;
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    TrailDataModel.updatePartial<ReallyAny>(modelInstance, value, modelRef as ReallyAny);
                    return modelRef as ModelReference<ReallyAny>;
                },
            } as StepApiModelAPI<M>;
        },
    };
};

export default { create };
