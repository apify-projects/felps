import Flow from '@usefelps/core--flow';
import { FlowDefinition, FlowInstance, FlowNamesObject, FlowOptions, ModelDefinition, ReallyAny, StepDefinition } from '@usefelps/types';

export const create = <
    F extends Record<string, FlowDefinition<string>>
>({ FLOWS }: { FLOWS: F }): Record<keyof F, FlowInstance<string>> => {
    return Object.keys(FLOWS).reduce((acc, name) => ({
        ...acc,
        [name]: Flow.create<string>({
            ...(FLOWS[name] || {}),
            name,
        } as FlowOptions<string>),
    }), {} as Record<keyof F, FlowInstance<string>>);
};

// eslint-disable-next-line max-len
export const use = <
    S extends Record<string, StepDefinition>,
    M extends Record<string, ModelDefinition>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(_: { STEPS: S, MODELS?: M }) => {
    return {
        define: <T extends Record<string, FlowDefinition<keyof S>>>(flows: T): T => {
            return flows as T;
            // return flows as unknown as FlowDefinitions<keyof S, T>;
        },
    };
};

export const names = <F extends Record<string, FlowDefinition<string>>>(FLOWS: F): FlowNamesObject<F> => {
    return Object.keys(FLOWS).reduce((acc, name) => ({
        ...acc,
        [name]: name,
    }), {} as FlowNamesObject<F>);
};

export const clone = <T>(flows: T): T => {
    return Object.keys(flows)
        .reduce((acc, name) => ({
            ...acc,
            [name]: Flow.create((flows as unknown as Record<string, FlowInstance<ReallyAny>>)[name]),
        }), {}) as T;
};

export default { create, use, names, clone };
