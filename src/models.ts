import { Model } from '.';
import { JSONSchemaWithMethods, ModelDefinition, ModelDefinitions } from './types';

export const create = <
    M extends Record<string, ModelDefinition>
>({ MODELS }: { MODELS: M }): M => {
    return Object.values(MODELS).reduce((namedModels, model) => {
        const m = Model.create(model);
        return {
            ...namedModels,
            [m.name]: m,
        };
    }, {} as M);
};

export const define = <T extends Record<string, ModelDefinition<JSONSchemaWithMethods>>>(models: T): ModelDefinitions<T> => {
    return Object.values(models).reduce((namedModels, model) => {
        const m = Model.create(model);
        return {
            ...namedModels,
            [m.name]: m,
        };
    }, {} as ModelDefinitions<T>);
};

export default { create, define };
