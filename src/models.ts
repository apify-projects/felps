import { camelCase } from 'camel-case';
import { ModelsInstance, ModelsOptions } from './common/types';
import flow from './flow';

export const create = <ModelDefinitions = Record<string, never>>
    (options?: ModelsOptions<Extract<keyof ModelDefinitions, string>>): ModelsInstance<ModelDefinitions> => {
    const { names = [] } = options || {};
    return names
        .map((name) => camelCase(name))
        .reduce((steps, name) => ({
            ...steps,
            [name]: flow.create({ name }),
        }), {} as ModelsInstance<ModelDefinitions>);
};

export default { create };
