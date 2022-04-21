import { curryN } from 'ramda';
import { FlowInstance, FlowOptions, StepInstance } from './common/types';
import base from './base';

export const create = (options: FlowOptions): FlowInstance => {
    const { name, crawlerMode, steps = [], output } = options || {};

    return {
        ...base.create({ key: 'flow', name }),
        crawlerMode,
        steps,
        output,
    };
};

export const has = curryN(2, (flow: FlowInstance, stepName: string): boolean => {
    return flow.steps.some((step: StepInstance) => step.name === stepName);
});

export const extend = curryN(2, (flow: FlowInstance, options: FlowOptions): FlowInstance => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...otherOptions } = options || {};
    return {
        ...flow,
        ...otherOptions,
    };
});

export default { create, has };
