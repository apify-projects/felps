import { JSONSchemaWithMethods, ModelDefinition, ModelDefinitions, ModelInstance, ModelReference } from './types';
import { Model } from '.';

export const create = <
    M extends Record<string, ModelDefinition>
>({ MODELS }: { MODELS: M }): M => {
    return Object.values(MODELS).reduce((namedModels, model) => ({
        ...namedModels,
        [model.name as string]: Model.create(model),
    }), {} as M);
};

export const define = <T extends Record<string, ModelDefinition<JSONSchemaWithMethods>>>(models: T): ModelDefinitions<T> => {
    return Object.values(models).reduce((namedModels, model) => ({
        ...namedModels,
        [model.name as string]: Model.create(model),
    }), {} as ModelDefinitions<T>);
};

export const matches = <T extends Record<string, ModelInstance>>(models: T, ref: ModelReference): ModelInstance[] => {
    return Object.values(models).filter((m) => Model.match(m, ref));
};

export default { create, define, matches };
