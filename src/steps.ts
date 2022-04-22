import { FlowDefinition, ModelDefinition, StepDefinition, StepDefinitions, StepsInstance } from './common/types';
import step from './step';

// <
//     Names extends Record<string, string> = Record<string, string>,
//     Methods = unknown,
//     CustomMethods extends Partial<Record<Extract<keyof Names, string>, unknown>> = Partial<Record<Extract<keyof Names, string>, unknown>>
//     >

export const create = <M, F, StepDefinitions>({ STEPS }: { MODELS?: M, FLOWS?: F, STEPS: StepDefinitions }): StepsInstance<M, F, StepDefinitions> => {
    return Object.keys(STEPS || {}).reduce((acc, name) => ({
        ...acc,
        [name]: step.create({ name, ...(STEPS[name] || {}) }),
    }), {} as StepsInstance<M, F, StepDefinitions>);
};

export const define = <T extends Record<string, StepDefinition>>(steps: T): StepDefinitions<T> => {
    return steps as unknown as StepDefinitions<T>;
};

export default { create, define };
