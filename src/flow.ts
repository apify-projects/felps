import { Model } from '.';
import base from './base';
import { FlowInstance, FlowOptions, ModelDefinition, JSONSchema } from './types';

export const create = <StepNames = string>(options: FlowOptions<StepNames>): FlowInstance<StepNames> => {
    const { name, crawlerMode, steps = [], input, output } = options || {};

    return {
        ...base.create({ key: 'flow', name }),
        crawlerMode,
        steps,
        input: Model.create(input as ModelDefinition<JSONSchema>),
        output: Model.create(output as ModelDefinition<JSONSchema>),
    };
};

export const has = <StepNames = unknown>(flow: FlowInstance<StepNames>, stepName: StepNames): boolean => {
    return (flow.steps || []).some((name) => name === stepName);
};

export default { create, has };
