import Step from '@usefelps/core--step';
import {
    FlowDefinition, InputDefinition, ModelDefinition, ReallyAny,
    StepDefinition, StepDefinitions, StepInstance, StepCollectionInstance,
} from '@usefelps/types';

export const create = <
    M extends Record<string, ModelDefinition>,
    F extends Record<string, FlowDefinition<keyof StepDefinitions>>,
    StepDefinitions extends Record<string, StepDefinition>,
    I extends InputDefinition
>({ STEPS }: { MODELS?: M, FLOWS?: F, STEPS: StepDefinitions, INPUT: I }): StepCollectionInstance<M, F, StepDefinitions, I> => {
    return Object.keys(STEPS || {} as ReallyAny).reduce((acc, name) => ({
        ...acc,
        [name]: Step.create({ name, ...(STEPS[name] || {}) }),
    }), {} as StepCollectionInstance<M, F, StepDefinitions, I>);
};

export const define = <T extends Record<string, StepDefinition>>(steps: T): StepDefinitions<T> => {
    return steps as unknown as StepDefinitions<T>;
};

export const clone = <T>(hooks: T): T => {
    return Object.keys(hooks)
        .reduce((acc, name) => ({
            ...acc,
            [name]: Step.create((hooks as unknown as Record<string, StepInstance>)[name]),
        }), {}) as T;
};

export default { create, define, clone };
