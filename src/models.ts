import { ModelDefinition, ModelDefinitions } from './common/types';
import model from './model';

export const create = <ModelDefinitions extends Record<string, ModelDefinition>>({ MODELS }: { MODELS: ModelDefinitions }): ModelDefinitions => {
    return Object.keys(MODELS).reduce((acc, name) => ({
        ...acc,
        [name]: model.create({ name, ...(MODELS[name] || {}) }),
    }), {} as ModelDefinitions);
};

export const define = <T extends Record<string, ModelDefinition>>(models: T): ModelDefinitions<T> => {
    return models as unknown as ModelDefinitions<T>;
};

export default { create, define };
