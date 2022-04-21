import { ActorInstance, GenerateStepApi, StepApiInstance } from './common/types';
import StepApiFlow from './step-api-flow';
import StepApiMeta from './step-api-meta';
import StepApiModel from './step-api-model';
import StepApiTrail from './step-api-trail';
import StepApiUtils from './step-api-utils';

export const create = <
    FlowNames, StepNames, ModelSchemas extends Record<string, unknown>
>(actor: ActorInstance): StepApiInstance<FlowNames, StepNames, ModelSchemas> => {
    return (context) => {
        return {
            ...StepApiTrail.create().handler(),
            ...StepApiFlow.create(actor).handler(context),
            ...StepApiMeta.create().handler(context),
            ...StepApiUtils.create(actor).handler(context),
            ...StepApiModel.create(actor).handler(context),
        } as unknown as GenerateStepApi<FlowNames, StepNames, ModelSchemas>;
    };
};

export default { create };
