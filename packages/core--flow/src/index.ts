import { UNPREFIXED_NAME_BY_ACTOR } from '@usefelps/core--constants';
import Base from '@usefelps/core--instance-base';
import Model from '@usefelps/core--model';
import { FlowInstance, FlowOptions, JSONSchema, ModelDefinition } from '@usefelps/types';

export const create = <StepNames = string>(options: FlowOptions<StepNames>): FlowInstance<StepNames> => {
    const { name, crawlerOptions, steps = [], flows = [], input, output, actorKey } = options || {};

    return {
        ...Base.create({ key: 'flow', name }),
        crawlerOptions,
        steps,
        flows,
        input: Model.create(input as ModelDefinition<JSONSchema>),
        output: Model.create(output as ModelDefinition<JSONSchema>),
        actorKey,
    };
};

export const has = <StepNames = unknown>(flow: FlowInstance<StepNames>, stepName: StepNames): boolean => {
    return (flow.steps || []).some((name) => UNPREFIXED_NAME_BY_ACTOR(name as unknown as string) === UNPREFIXED_NAME_BY_ACTOR(stepName as unknown as string));
};

export default { create, has };
