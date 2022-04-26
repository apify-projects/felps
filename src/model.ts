import { pickAll } from 'ramda';
import base from './base';
import { REFERENCE_KEY, SCHEMA_MODEL_NAME_KEY, TRAIL_KEY_PROP } from './consts';
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
                        [SCHEMA_MODEL_NAME_KEY]: model.name,
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

export const walk = (model: ModelInstance, walker: (key: string, value: reallyAny) => void): void => {
    traverse(model.schema, walker);
};

export const dependencies = (model: ModelInstance, { unique }: { unique: boolean } = { unique: true }): string[] => {
    const deps: string[] = [];
    walk(model, (key, value) => {
        if (key === SCHEMA_MODEL_NAME_KEY) deps.push(value[key]);
    });
    return unique ? Array.from(new Set(deps)) : deps;
};

export const referenceKeys = (model: ModelInstance): string[] => {
    return [
        TRAIL_KEY_PROP,
        ...dependencies(model)
            .filter((key) => key !== model.name)
            .map((key) => REFERENCE_KEY(key)),
    ];
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

export const match = (model: ModelInstance, ref: ModelReference): boolean => {
    return Object.values(referenceFor(model, ref, true)).every((value) => value !== undefined);
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
    async organize(model: ModelInstance, items: TrailDataModelItem[]): Promise<{ valid: TrailDataModelItem[], invalid: TrailDataModelItem[] }> {
        const valid = await Promise.resolve((model.schema as JSONSchemaMethods).organize?.(items, api)) || items;
        const invalid = items.filter((item) => !valid.includes(item));
        return { valid, invalid };
    },
    async limit(model: ModelInstance, items: TrailDataModelItem[]): Promise<boolean> {
        return (model.schema as JSONSchemaMethods).limit?.(items, api) || false;
    },
});

export default { create, dependencies, referenceKeys, referenceFor, match, validate, validateReference, connect, wrap, walk };
