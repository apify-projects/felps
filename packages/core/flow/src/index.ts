import * as CONST from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import Model from '@usefelps/model';
import { pathify } from '@usefelps/utils';
import * as FT from '@usefelps/types';

export const create =(options: FT.FlowOptions): FT.FlowInstance => {
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

export const createKeyed = (options: FT.FlowOptions): { [name: FT.FlowOptions['name']]: FT.FlowInstance } => {
    const instance = create(options);
    return { [instance.name]: instance };
};

export const has = (flow: FT.FlowInstance, stepName: string): boolean => {
    return (flow.steps || []).some((name: any) => CONST.UNPREFIXED_NAME_BY_ACTOR(name) === CONST.UNPREFIXED_NAME_BY_ACTOR(stepName));
};

export default { create, createKeyed, has };
