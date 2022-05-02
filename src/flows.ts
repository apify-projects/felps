import Flow from './flow';
import { FlowDefinition, FlowDefinitions, FlowNamesObject, ModelDefinition, StepDefinition } from './types';

export const create = <
    F extends Record<string, FlowDefinition<string>>
>({ FLOWS }: { FLOWS: F }): F => {
    return Object.keys(FLOWS).reduce((acc, name) => ({
        ...acc,
        [name]: Flow.create<string>({
            ...(FLOWS[name] || {}),
            name,
        }),
    }), {} as F);
};

// eslint-disable-next-line max-len
export const use = <
    S extends Record<string, StepDefinition>,
    M extends Record<string, ModelDefinition>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(_: { STEPS: S, MODELS?: M }) => {
    return {
        define: <T extends Record<string, FlowDefinition<keyof S>>>(flows: T): FlowDefinitions<keyof S, T> => {
            return flows as unknown as FlowDefinitions<keyof S, T>;
        },
    };
};

export const names = <F extends Record<string, FlowDefinition<string>>>(FLOWS: F): FlowNamesObject<F> => {
    return Object.keys(FLOWS).reduce((acc, name) => ({
        ...acc,
        [name]: name,
    }), {} as FlowNamesObject<F>);
};

export default { create, use, names };
