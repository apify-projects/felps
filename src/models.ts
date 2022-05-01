import { Model } from '.';
import { JSONSchemaWithMethods, ModelDefinition, ModelDefinitions } from './types';

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

export default { create, define };
