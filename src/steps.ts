import { FlowDefinition, InputDefinition, ModelDefinition, ReallyAny, StepDefinition, StepDefinitions, StepsInstance } from './types';
import step from './step';

export const create = <
    M extends Record<string, ModelDefinition>,
    F extends Record<string, FlowDefinition>,
    StepDefinitions extends Record<string, StepDefinition>,
    I extends InputDefinition
>({ STEPS }: { MODELS?: M, FLOWS?: F, STEPS: StepDefinitions, INPUT: I }): StepsInstance<M, F, StepDefinitions, I> => {
    return Object.keys(STEPS || {} as ReallyAny).reduce((acc, name) => ({
        ...acc,
        [name]: step.create({ name, ...(STEPS[name] || {}) }),
    }), {} as StepsInstance<M, F, StepDefinitions, I>);
};

export const define = <T extends Record<string, StepDefinition>>(steps: T): StepDefinitions<T> => {
    return steps as unknown as StepDefinitions<T>;
};

export default { create, define };
