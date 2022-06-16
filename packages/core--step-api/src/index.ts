import StepApiFlow from '@usefelps/core--step-api--flow';
import StepApiMeta from '@usefelps/core--step-api--meta';
import StepApiModel from '@usefelps/core--step-api--model';
import StepApiHelpers from '@usefelps/core--step-api--helpers';
import { ActorInstance, FlowDefinition, InputDefinition, ModelDefinition, RequestContext, StepApiInstance } from '@usefelps/types';

export const create = <
    F extends Record<string, FlowDefinition<keyof S>>,
    S,
    M extends Record<string, ModelDefinition>,
    I extends InputDefinition,
    >(actor: ActorInstance) => { // , options?: StepApiOptions
    return (context: RequestContext) => {
        const api = {
            ...StepApiFlow.create(actor).handler(context),
            ...StepApiMeta.create(actor).handler(context),
            ...StepApiModel.create(actor).handler(context),
            ...StepApiHelpers.create().handler(context),
        };

        return api as unknown as StepApiInstance<F, S, M, I>;
        // return {
        //     ...api,
        //     // ...(options?.extend?.(context, api, actor) || {}),
        // };
    };
};

export default { create };
