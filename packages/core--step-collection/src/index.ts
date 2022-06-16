import Step from '@usefelps/core--step';
import * as FT from '@usefelps/types';

export const create = <
    M extends Record<string, FT.ModelDefinition>,
    F extends Record<string, FT.FlowDefinition<keyof StepDefinitions>>,
    StepDefinitions extends Record<string, FT.StepDefinition>,
    I extends FT.InputDefinition
>({ STEPS }: { MODELS?: M, FLOWS?: F, STEPS: StepDefinitions, INPUT: I }): FT.StepCollectionInstance<M, F, StepDefinitions, I> => {
    return Object.keys(STEPS || {} as FT.ReallyAny).reduce((acc, name) => ({
        ...acc,
        [name]: Step.create({ name, ...(STEPS[name] || {}) }),
    }), {} as FT.StepCollectionInstance<M, F, StepDefinitions, I>);
};

export const define = <T extends Record<string, FT.StepDefinition>>(steps: T): FT.StepDefinitions<T> => {
    return steps as unknown as FT.StepDefinitions<T>;
};

export const clone = <T>(hooks: T): T => {
    return Object.keys(hooks)
        .reduce((acc, name) => ({
            ...acc,
            [name]: Step.create((hooks as unknown as Record<string, FT.StepInstance>)[name]),
        }), {}) as T;
};

export default { create, define, clone };
