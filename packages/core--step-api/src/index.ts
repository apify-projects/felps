import StepApiFlow from '@usefelps/core--step-api--flow';
import StepApiMeta from '@usefelps/core--step-api--meta';
import StepApiModel from '@usefelps/core--step-api--model';
import StepApiHelpers from '@usefelps/core--step-api--helpers';
import * as FT from '@usefelps/types';

export const create = <
    F extends Record<string, FT.FlowDefinition<keyof S>> = FT.ReallyAny,
    S = FT.ReallyAny,
    M extends Record<string, FT.ModelDefinition> = FT.ReallyAny,
    I extends FT.InputDefinition = FT.ReallyAny,
>(actor: FT.ActorInstance) => { // , options?: StepApiOptions
    return (context: FT.RequestContext) => {
        const api = {
            ...StepApiFlow.create(actor).handler(context),
            ...StepApiMeta.create(actor).handler(context),
            ...StepApiModel.create(actor).handler(context),
            ...StepApiHelpers.create().handler(context),
        };

        return api as unknown as FT.StepApiInstance<F, S, M, I>;
        // return {
        //     ...api,
        //     // ...(options?.extend?.(context, api, actor) || {}),
        // };
    };
};

export default { create };
