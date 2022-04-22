import { FlowDefinition, ModelDefinition, reallyAny, StepDefinition, StepDefinitions, StepsInstance } from './common/types';
import step from './step';

export const create = <
    M extends Record<string, ModelDefinition>,
    F extends Record<string, FlowDefinition>,
    StepDefinitions extends Record<string, StepDefinition>
>({ STEPS }: { MODELS?: M, FLOWS?: F, STEPS: StepDefinitions }): StepsInstance<M, F, StepDefinitions> => {
    return Object.keys(STEPS || {} as reallyAny).reduce((acc, name) => ({
        ...acc,
        [name]: step.create({ name, ...(STEPS[name] || {}) }),
    }), {} as StepsInstance<M, F, StepDefinitions>);
};

export const define = <T extends Record<string, StepDefinition>>(steps: T): StepDefinitions<T> => {
    return steps as unknown as StepDefinitions<T>;
};

export default { create, define };
