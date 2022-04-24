import { Model, RequestMeta, Trail } from '.';
import base from './base';
import { ActorInstance, ModelDefinition, ModelReference, reallyAny, StepApiModelAPI, StepApiModelInstance } from './types';
import TrailDataModel from './trail-data-model';

// eslint-disable-next-line max-len
export const create = <M extends Record<string, ModelDefinition>>(actor: ActorInstance): StepApiModelInstance<M> => {
    return {
        ...base.create({ key: 'step-api-models', name: 'default' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);

            const meta = RequestMeta.create(context?.request);

            const getModelDetails = (modelName: string, ref: ModelReference = {}, options?: { withOwnReferenceKey?: boolean }) => {
                const { withOwnReferenceKey = false } = options || {};
                const modelInstance = ingest.models?.[modelName];
                const modelRef = Model.referenceFor(modelInstance.model, { ...meta.data.reference, ...ref }, withOwnReferenceKey);
                Model.validateReference(modelInstance.model, modelRef, { throwError: true });
                return { modelInstance, modelRef };
            };

            return {
                set(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref);
                    Model.validate(modelInstance.model, value, { throwError: true });
                    return TrailDataModel.set(modelInstance, value as reallyAny, modelRef) as ModelReference<reallyAny>;
                },
                get(modelName, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    return TrailDataModel.get(modelInstance, modelRef);
                },
                update(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    TrailDataModel.update(modelInstance, value, modelRef as reallyAny);
                    return ref as ModelReference<reallyAny>;
                },
            } as StepApiModelAPI<M>;
        },
    };
};

export default { create };
