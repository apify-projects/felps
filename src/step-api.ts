import { ActorInstance, GenerateStepApi, StepApiInstance } from './common/types';
import StepApiFlows from './step-api-flows';
import StepApiMeta from './step-api-meta';
import StepApiModels from './step-api-models';
import StepApiSteps from './step-api-steps';
import StepApiTrail from './step-api-trail';
import StepApiUtils from './step-api-utils';

export const create = <
    FlowNames, StepNames, ModelSchemas extends Record<string, unknown>
>(actor: ActorInstance): StepApiInstance<FlowNames, StepNames, ModelSchemas> => {
    return (context) => {
        return {
            ...StepApiTrail.create().handler(),
            ...StepApiSteps.create().handler(context),
            ...StepApiFlows.create(actor).handler(context),
            ...StepApiMeta.create().handler(context),
            ...StepApiUtils.create(actor).handler(context),
            ...StepApiModels.create().handler(context),
        } as unknown as GenerateStepApi<FlowNames, StepNames, ModelSchemas>;
    };
};

export default { create };
