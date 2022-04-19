import { ModelsInstance, ModelsOptions } from './common/types';
import model from './model';

export const create = <ModelDefinitions = Record<string, never>>
    (options?: ModelsOptions<Extract<keyof ModelDefinitions, string>>): ModelsInstance<ModelDefinitions> => {
    const { names = [] } = options || {};
    return names
        .reduce((steps, name) => ({
            ...steps,
            [name]: model.create({ name }),
        }), {} as ModelsInstance<ModelDefinitions>);
};

export default { create };
