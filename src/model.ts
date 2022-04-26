import { pickAll } from 'ramda';
import base from './base';
import { REFERENCE_KEY, TRAIL_KEY_PROP } from './consts';
import {
    GeneralStepApi, JSONSchema, JSONSchemaMethods, ModelInstance,
    ModelOptions, ModelReference, reallyAny, TrailDataModelItem, ValidatorValidateOptions,
} from './types';
import { traverse } from './utils';
import Validator from './validator';

export const wrap = (model: ModelInstance<JSONSchema>): ModelInstance<JSONSchema> => {
    return new Proxy(
        model,
        {
            get: (target, prop) => {
                if (prop === 'schema') {
                    return {
                        ...target.schema as unknown as Record<string, reallyAny>,
                        modelName: model.name,
                    };
                }

                return target[prop as keyof ModelInstance];
            },
        });
};

export const create = (options: ModelOptions): ModelInstance<JSONSchema> => {
    const { name, schema } = options || {};

    return wrap({
        ...base.create({ name: name as string, key: 'model' }),
        schema,
    });
};

export const extend = (model: ModelInstance, options: ModelOptions): ModelInstance => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...otherOptions } = options || {};
    return wrap({
        ...model,
        ...otherOptions,
    });
};

export const dependencies = (model: ModelInstance): string[] => {
    const deps = new Set<string>();
    traverse(model.schema, (key, value) => {
        if (key === '#schema-name') deps.add(value);
    });
    return [...deps];
};

export const referenceKeys = (model: ModelInstance): string[] => {
    return [TRAIL_KEY_PROP, ...dependencies(model).map((modelName) => REFERENCE_KEY(modelName))];
};

export const referenceKeysSchema = (model: ModelInstance): JSONSchema => {
    const keys = referenceKeys(model);
    return {
        type: 'object',
        properties: keys.reduce((acc, key) => {
            acc[key] = { type: 'string' };
            return acc;
        }, {} as Record<string, JSONSchema>),
        required: keys,
    };
};

export const referenceFor = (model: ModelInstance, ref: ModelReference, withOwnReferenceKey?: boolean): ModelReference => {
    const keys = referenceKeys(model);
    if (withOwnReferenceKey) keys.unshift(REFERENCE_KEY(model.name));
    return pickAll(keys, ref);
};

export const validate = <T = unknown>(model: ModelInstance<JSONSchema>, data: T, options: ValidatorValidateOptions = {}): boolean => {
    const validator = Validator.create({ name: model.name, schema: model.schema });
    return Validator.validate(validator, data, { partial: false, logError: true, throwError: false, ...options });
};

export const validateReference = <T = unknown>(model: ModelInstance, ref: ModelReference<T>, options: ValidatorValidateOptions = {}): boolean => {
    const validator = Validator.create({ name: model.name, schema: referenceKeysSchema(model) });
    return Validator.validate(validator, ref, { partial: false, logError: true, throwError: false, ...options });
};

export const connect = ({ api }: { api: GeneralStepApi }) => ({
    async transform(model: ModelInstance, items: TrailDataModelItem[]): Promise<{ valid: TrailDataModelItem[], invalid: TrailDataModelItem[] }> {
        const valid = await Promise.resolve((model.schema as JSONSchemaMethods).transform?.(items, api)) || items;
        const invalid = items.filter((item) => !valid.includes(item));
        return { valid, invalid };
    },
});

export default { create, dependencies, referenceKeys, referenceFor, validate, validateReference, connect, wrap };
