import stringify from 'fast-safe-stringify';
import { pickAll } from 'ramda';
import base from './base';
import { REFERENCE_KEY, SCHEMA_MODEL_NAME_KEY, TRAIL_KEY_PROP } from './consts';
import {
    GeneralStepApi, JSONSchema, JSONSchemaMethods, JSONSchemaObject, JSONSchemaWithMethods, ModelDefinition, ModelInstance,
    ModelOptions, ModelReference, ReallyAny, ReferenceKey, TrailDataModelItem, ValidatorValidateOptions,
} from './types';
import { traverse, traverseAndCarry } from './utils';
import Validator from './validator';

export const create = (options: ModelOptions): ModelInstance<JSONSchema> => {
    const { parentType, parentKey, parents = [] } = options;
    let { schema, name } = options;

    name = name || (schema as JSONSchemaObject)?.modelName;
    schema = { modelName: name, ...schema as JSONSchemaObject };

    return {
        ...base.create({ name, key: 'model' }),
        schema,
        parentType,
        parentKey,
        parents,
    };
};

export const define = <T extends ModelDefinition<JSONSchemaWithMethods>>(model: T): T => {
    return model as T;
};

export const walk = (model: ModelInstance, walker: (key: string, value: ReallyAny) => void): void => {
    traverse(model.schema, walker);
};

export const flatten = (model: ModelInstance): ModelInstance[] => {
    const models = new Set<ModelInstance>();
    traverseAndCarry(
        model.schema,
        {
            parentPath: [],
            parents: [],
        },
        (value, key, ctx) => {
            const parentPath = [...ctx.parentPath, key].filter(Boolean);
            if (SCHEMA_MODEL_NAME_KEY in value) {
                const modelName: string = value[SCHEMA_MODEL_NAME_KEY];
                let parentKey = parentPath.slice(-1)[0];
                const parentType = parentKey === 'items' ? 'array' : value.type;
                if (parentKey === 'items') parentKey = parentPath.slice(-2)[0];

                models.add(
                    create({
                        name: modelName,
                        schema: value,
                        parentType,
                        parentKey,
                        parents: ctx.parents,
                    }),
                );

                return {
                    ...ctx,
                    parentPath,
                    parents: [...ctx.parents, modelName],
                };
            };

            return {
                ...ctx,
                parentPath,
            };
        });

    return [...models];
};

export const dependencies = (model: ModelInstance): ModelInstance[] => {
    return flatten(model).filter((m) => m.name !== model.name);
};

export const referenceKeys = (model: ModelInstance): ReferenceKey[] => {
    return [
        TRAIL_KEY_PROP,
        ...(model.parents || []).map((key) => REFERENCE_KEY(key)),
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

export const validate = <T = unknown>(model: ModelInstance<JSONSchema>, data: T, options: ValidatorValidateOptions = {}) => {
    const validator = Validator.create({ name: model.name, schema: model.schema });
    return Validator.validate(validator, data, { partial: false, logError: true, throwError: false, ...options });
};

export const validateReference = <T = unknown>(model: ModelInstance, ref: ModelReference<T>, options: ValidatorValidateOptions = {}) => {
    const validator = Validator.create({ name: model.name, schema: referenceKeysSchema(model) });
    return Validator.validate(validator, ref, { partial: false, logError: true, throwError: false, ...options });
};

export const find = (
    model: ModelInstance, items: TrailDataModelItem<ReallyAny>[], newItem: TrailDataModelItem<ReallyAny>): TrailDataModelItem<ReallyAny> | undefined => {
    for (const item of items) {
        if ((model.schema as JSONSchemaMethods).isItemUnique?.(item, newItem)) return item;
    }
    return undefined;
};

export const connect = ({ api }: { api: GeneralStepApi }) => ({
    async organizeList(model: ModelInstance, items: TrailDataModelItem[]): Promise<{ valid: TrailDataModelItem[], invalid: TrailDataModelItem[] }> {
        const valid = await Promise.resolve((model.schema as JSONSchemaMethods)?.organizeList?.(items, api)) || items;
        const invalid = items.filter((item) => !valid.includes(item));
        return { valid, invalid };
    },
    async isListComplete(model: ModelInstance, items: TrailDataModelItem[]): Promise<boolean> {
        return (model.schema as JSONSchemaMethods).isListComplete?.(items, api) || false;
    },
});

export const schemaAsRaw = <T>(schema: T): T => {
    return JSON.parse(
        stringify(schema, (key, value) => {
            if (key === 'modelName') return undefined;
            return value;
        }),
    );
};

export default { create, define, dependencies, referenceKeys, referenceFor, find, validate, validateReference, connect, walk, flatten, schemaAsRaw };
