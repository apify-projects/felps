import { ActorInstance, InputDefinition, ModelDefinition, RequestContext, StepApiInstance } from './types';
import StepApiFlow from './step-api-flow';
import StepApiMeta from './step-api-meta';
import StepApiModel from './step-api-model';
import StepApiUtils from './step-api-utils';

export const create = <
    F, S, M extends Record<string, ModelDefinition>, I extends InputDefinition
>(actor: ActorInstance) => {
    return (context: RequestContext) => {
        return {
            ...StepApiFlow.create(actor).handler(context),
            ...StepApiMeta.create().handler(context),
            ...StepApiUtils.create(actor).handler(context),
            ...StepApiModel.create(actor).handler(context),
        } as unknown as StepApiInstance<F, S, M, I>;
    };
};

export default { create };
