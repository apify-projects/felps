import { ModelDefinition, ModelDefinitions, ModelsInstance, ModelsOptions } from './common/types';
import model from './model';

export const create = <ModelDefinitions>(options?: ModelsOptions<ModelDefinitions>): ModelsInstance<ModelDefinitions> => {
    const { MODELS } = options || {};

    return Object.keys(MODELS || {}).reduce((acc, name) => ({
        ...acc,
        [name]: model.create({ name, ...(MODELS[name] || {}) }),
    }), {} as ModelsInstance<ModelDefinitions>);
};

export const define = <T extends Record<string, ModelDefinition>>(models: T): ModelDefinitions<T> => {
    return models as unknown as ModelDefinitions<T>;
};

export default { create, define };
