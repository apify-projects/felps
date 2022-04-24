import { ModelDefinition, ModelDefinitions } from './types';
import model from './model';

export const create = <
    M extends Record<string, ModelDefinition>
>({ MODELS }: { MODELS: M }): M => {
    return Object.keys(MODELS).reduce((acc, name) => ({
        ...acc,
        [name]: model.create({ name, ...(MODELS[name] || {}) }),
    }), {} as M);
};

export const define = <T extends Record<string, ModelDefinition>>(models: T): ModelDefinitions<T> => {
    return models as unknown as ModelDefinitions<T>;
};

export default { create, define };
