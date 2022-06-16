import Model from '@usefelps/core--model';
import * as utils from '@usefelps/helper--utils';
import * as FT from '@usefelps/types';

export const create = <
    M extends Record<string, FT.ModelDefinition>
>({ MODELS }: { MODELS: M }): M => {
    return Object.values(MODELS).reduce((namedModels, model) => {
        const m = Model.create(model);
        return {
            ...namedModels,
            [m.name]: m,
        };
    }, {} as M);
};

export const define = <T extends Record<string, FT.ModelDefinition<FT.JSONSchemaWithMethods>>>(models: T): FT.ModelDefinitions<T> => {
    return Object.values(models).reduce((namedModels, model) => {
        const m = Model.create(model);
        return {
            ...namedModels,
            [m.name]: m,
        };
    }, {} as FT.ModelDefinitions<T>);
};

export const clone = <T>(models: T): T => {
    return utils.clone(models);
};

export default { create, define, clone };
