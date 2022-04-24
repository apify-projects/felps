import base from './base';
import { FlowInstance, FlowOptions } from './types';

export const create = <StepNames = string>(options: FlowOptions<StepNames>): FlowInstance<StepNames> => {
    const { name, crawlerMode, steps = [], output } = options || {};

    return {
        ...base.create({ key: 'flow', name }),
        crawlerMode,
        steps,
        output,
    };
};

export const has = <StepNames = unknown>(flow: FlowInstance<StepNames>, stepName: StepNames): boolean => {
    return flow.steps.some((name) => name === stepName);
};

export default { create, has };
