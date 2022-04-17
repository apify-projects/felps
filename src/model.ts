import { JSONSchema7 } from 'json-schema';
import { REFERENCE_KEY } from '../common/consts';
import { ModelInstance, ModelOptions, ModelReference } from './common/types';
import { traverse } from './common/utils';
import base from './base';

export const create = (options: ModelOptions): ModelInstance => {
    const { name, schema } = options || {};

    return {
        ...base.create({ name, key: 'model' }),
        schema,
    };
};

export const extend = (model: ModelInstance, options: ModelOptions): ModelInstance => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...otherOptions } = options || {};
    return {
        ...model,
        ...otherOptions,
    };
};

export const schema = (model: ModelInstance): JSONSchema7 => {
    return {
        ...model.schema,
        '#schema-name': model.name,
    } as JSONSchema7;
};

export const dependencies = (model: ModelInstance): string[] => {
    const deps = new Set<string>();
    traverse(model.schema, (key, value) => {
        if (key === '#schema-name') deps.add(value);
    });
    return [...deps];
};

export const referenceKeys = (model: ModelInstance): string[] => {
    return dependencies(model).map((modelName) => REFERENCE_KEY(modelName));
};

export const references = (model: ModelInstance, ref: Partial<ModelReference>): Partial<ModelReference> => {
    return referenceKeys(model).reduce((acc, key) => {
        acc[key] = ref[key];
        return acc;
    }, {});
};

export default { create, schema, dependencies, referenceKeys, references };
