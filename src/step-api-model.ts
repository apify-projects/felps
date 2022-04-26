import { Model, RequestMeta, Trail } from '.';
import base from './base';
import TrailDataModel from './trail-data-model';
import { ActorInstance, ModelDefinition, ModelReference, reallyAny, StepApiModelAPI, StepApiModelInstance, TrailDataStage } from './types';

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
                    return TrailDataModel.set(modelInstance, value as reallyAny, modelRef) as ModelReference<reallyAny>;
                },
                addPartial(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName as string, ref);
                    Model.validate(modelInstance.model, value, { throwError: true });
                    return TrailDataModel.setPartial(modelInstance, value as reallyAny, modelRef) as ModelReference<reallyAny>;
                },
                get(modelName, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName as string, ref, { withOwnReferenceKey: true });
                    return TrailDataModel.get(modelInstance, modelRef);
                },
                update(modelName, valueOrReducer, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(ingest)(modelName as string, ref, { withOwnReferenceKey: true });
                    const value = typeof valueOrReducer === 'function'
                        ? valueOrReducer(TrailDataModel.get(modelInstance, modelRef).data as reallyAny)
                        : valueOrReducer;
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    TrailDataModel.update<reallyAny>(modelInstance, value, modelRef as reallyAny);
                    return ref as ModelReference<reallyAny>;
                },
            } as StepApiModelAPI<M>;
        },
    };
};

export default { create };
