import * as CONST from '@usefelps/constants';
import Base from '@usefelps/core--instance-base';
import Model from '@usefelps/core--model';
import { pathify } from '@usefelps/helper--utils';
import * as FT from '@usefelps/types';

export const create = <StepNames = string>(options: FT.FlowOptions<StepNames>): FT.FlowInstance<StepNames> => {
    const { name, crawlerOptions, steps = [], flows = [], input, output, reference } = options || {};

    return {
        ...Base.create({ key: 'flow', name: pathify(reference.fActorKey, name) }),
        crawlerOptions,
        steps,
        flows,
        input: Model.create(input as FT.ModelDefinition<FT.JSONSchema>),
        output: Model.create(output as FT.ModelDefinition<FT.JSONSchema>),
        reference,
    };
};

export const has = <StepNames = unknown>(flow: FT.FlowInstance<StepNames>, stepName: StepNames): boolean => {
    return (flow.steps || []).some((name: any) => CONST.UNPREFIXED_NAME_BY_ACTOR(name) === CONST.UNPREFIXED_NAME_BY_ACTOR(stepName as unknown as string));
};

export default { create, has };
