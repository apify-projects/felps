import { ModelDefinition, ModelDefinitions, ModelInstance, ModelReference } from './types';
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

export const matches = <T extends Record<string, ModelInstance>>(models: T, ref: ModelReference): ModelInstance[] => {
    return Object.values(models).filter((m) => model.match(m, ref));
};

export default { create, define, matches };
