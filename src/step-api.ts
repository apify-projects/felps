import StepApiFlow from './step-api-flow';
import StepApiMeta from './step-api-meta';
import StepApiModel from './step-api-model';
import StepApiUtils from './step-api-utils';
import { ActorInstance, FlowDefinition, InputDefinition, ModelDefinition, RequestContext, StepApiInstance } from './types';

export const create = <
    F extends Record<string, FlowDefinition<keyof S>>,
    S,
    M extends Record<string, ModelDefinition>,
    I extends InputDefinition,
    >(actor: ActorInstance) => {
    return (context: RequestContext) => {
        const api = {
            ...StepApiFlow.create(actor).handler(context),
            ...StepApiMeta.create(actor).handler(context),
            ...StepApiUtils.create().handler(context),
            ...StepApiModel.create(actor).handler(context),
        } as unknown as StepApiInstance<F, S, M, I>;
        return api;
    };
};

export default { create };
