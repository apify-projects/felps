import Model from '@usefelps/core--model';
import { clone } from '@usefelps/helper--utils';
import { JSONSchemaWithMethods, ModelDefinition, ModelDefinitions } from '@usefelps/types';

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

export const clone = <T>(models: T): T => {
    return cloneDeep(models);
};

export default { create, define, clone };
