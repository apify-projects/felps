import { JSONSchema7 } from 'json-schema';
import { pickAll } from 'ramda';
import base from './base';
import { REFERENCE_KEY } from './consts';
import { ModelInstance, ModelOptions, ModelReference, reallyAny, ValidatorValidateOptions } from './types';
import { traverse } from './utils';
import Validator from './validator';

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
        ...(model.schema as Record<string, reallyAny>),
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

export const referenceKeysSchema = (model: ModelInstance): JSONSchema7 => {
    const keys = referenceKeys(model);
    return {
        type: 'object',
        properties: keys.reduce((acc, key) => {
            acc[key] = { type: 'string' };
            return acc;
        }, {} as Record<string, JSONSchema7>),
        required: keys,
    };
};

export const referenceFor = (model: ModelInstance, ref: ModelReference, withOwnReferenceKey?: boolean): ModelReference => {
    const keys = referenceKeys(model);
    if (withOwnReferenceKey) keys.unshift(REFERENCE_KEY(model.name));
    return pickAll(keys, ref);
};

export const validate = <T = unknown>(model: ModelInstance, data: T, options: ValidatorValidateOptions = {}): boolean => {
    const validator = Validator.create({ name: model.name, schema: model.schema });
    return Validator.validate(validator, data, { partial: false, logError: true, throwError: false, ...options });
};

export const validateReference = <T = unknown>(model: ModelInstance, ref: ModelReference<T>, options: ValidatorValidateOptions = {}): boolean => {
    const validator = Validator.create({ name: model.name, schema: referenceKeysSchema(model) });
    return Validator.validate(validator, ref, { partial: false, logError: true, throwError: false, ...options });
};

export default { create, schema, dependencies, referenceKeys, referenceFor, validate, validateReference };
