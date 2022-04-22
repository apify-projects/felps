import { FlowDefinition, FlowDefinitions, FlowsInstance, FlowsOptions, ModelDefinition, StepDefinition } from './common/types';
import Flow from './flow';

export const create = <FlowDefinitions>(options?: FlowsOptions<FlowDefinitions>): FlowsInstance<FlowDefinitions> => {
    const { FLOWS = [] } = options || {};

    return Object.keys(FLOWS || {}).reduce((acc, name) => ({
        ...acc,
        [name]: Flow.create({ name, ...(FLOWS[name] || {}) }),
    }), {} as FlowsInstance<FlowDefinitions>);
};

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const use = <S extends Record<string, StepDefinition>, M extends Record<string, ModelDefinition>>(_: { STEPS: S, MODELS?: M }) => {
    return {
        define: <T extends Record<string, FlowDefinition<keyof S>>>(flows: T): FlowDefinitions<keyof S, T> => {
            return flows as FlowDefinitions<keyof S, T>;
        },
    };
};

export default { create, use };

//     Definitions extends Record<keyof FlowNames, string[]> = Record<keyof FlowNames, string[]>
