import * as CONST from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import * as FT from '@usefelps/types';

export const create = <
    FlowNames extends string = string,
    StepNames extends string = string,
>(options: FT.FlowOptions<FlowNames, StepNames>): FT.FlowInstance<FlowNames, StepNames> => {
    const { name, crawlerMode, steps = [], meta = {} } = options || {};

    const base = Base.create({ key: 'flow', name });

    return {
        ...base,
        name: base.name as FlowNames,
        crawlerMode,
        steps,
        meta,
    };
};

export const has = (flow: FT.FlowInstance, stepName: string): boolean => {
    return (flow.steps || []).some((name: any) => CONST.UNPREFIXED_NAME_BY_ACTOR(name) === CONST.UNPREFIXED_NAME_BY_ACTOR(stepName));
};

export default { create, has };
