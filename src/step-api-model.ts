import { Model, RequestMeta, Trail } from '.';
import base from './base';
import { ActorInstance, ModelReference, reallyAny, StepApiModelAPI, StepApiModelInstance } from './common/types';
import TrailDataModel from './trail-data-model';

// eslint-disable-next-line max-len
export const create = <
    ModelSchemas extends Record<string, unknown> = Record<string, unknown>
>(actor: ActorInstance): StepApiModelInstance<ModelSchemas> => {
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
                    return TrailDataModel.set(modelInstance, value, modelRef);
                },
                get(modelName, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    return TrailDataModel.get(modelInstance, modelRef);
                },
                update(modelName, value, ref?) {
                    const { modelInstance, modelRef } = getModelDetails(modelName as string, ref, { withOwnReferenceKey: true });
                    Model.validate(modelInstance.model, value, { partial: true, throwError: true });
                    console.log('update', value, modelRef, meta.data.reference);
                    return TrailDataModel.update(modelInstance, value, modelRef as reallyAny);
                },
            } as StepApiModelAPI<ModelSchemas>;
        },
    };
};

export default { create };
