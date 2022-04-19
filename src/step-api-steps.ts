import base from './base';
import { StepApiStepsAPI, StepApiStepsInstance } from './common/types';

export const create = <StepNames = unknown, ModelSchemas = unknown>(): StepApiStepsInstance<StepNames, ModelSchemas> => {
    return {
        ...base.create({ key: 'step-api-steps', name: 'step-api-steps' }),
        handler() {
            return {} as StepApiStepsAPI<StepNames, ModelSchemas>;
        },
    };
};

export default { create };
