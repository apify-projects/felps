import stringify from 'fast-safe-stringify';
import get from 'lodash.get';
import pick from 'lodash.pick';
import Base from '@usefelps/core--instance-base';
import { REFERENCE_KEY, SCHEMA_MODEL_NAME_KEY, TRAIL_KEY_PROP } from '@usefelps/core--constants';
import {
    GeneralStepApi, JSONSchema, JSONSchemaMethods, JSONSchemaObject, JSONSchemaWithMethods, ModelDefinition, ModelInstance,
    ModelOptions, ModelReference, ReallyAny, ReferenceKey, TrailDataModelItem, ValidatorValidateOptions,
} from '@usefelps/types';
import { traverse, traverseAndCarry } from '@usefelps/helper--utils';
import Validator from './validator';

export const create = (options: ModelOptions): ModelInstance<JSONSchema> => {
    const { parentType, parentPath, parents = [] } = options;
    let { schema, name } = options;

    name = name || (schema as JSONSchemaObject)?.modelName;
    schema = { modelName: name, ...schema as JSONSchemaObject };

    return {
        ...Base.create({ name, key: 'model' }),
        schema,
        parentType,
        parentPath,
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
            parentPathSegments: [],
            parents: [],
        },
        (value, key, ctx) => {
            const parentPathSegments: string[] = [...ctx.parentPathSegments, key].filter(Boolean);
            if (SCHEMA_MODEL_NAME_KEY in value) {
                const modelName: string = value[SCHEMA_MODEL_NAME_KEY];
                const parentType = parentPathSegments.slice(-1)[0] === 'items' ? 'array' : value.type;

                // TO BE OPTIMIZED
                // ttems or properties could well be valid object keys as well
                // const lastItemsKeyIndex = [...parentPathSegments].reverse().findIndex((k) => k === 'items');
                // const parentPath = parentType === 'array'
                //     ? parentPathSegments.slice(-lastItemsKeyIndex).join('.')
                //     : parentPathSegments.filter((segment) => !['items', 'properties'].includes(segment)).join('.');

                const parentPath = parentPathSegments.filter((segment) => !['items', 'properties'].includes(segment)).join('.');

                // console.log({
                //     name: modelName,
                //     schema: value,
                //     parentType,
                //     parentPath,
                //     parents: ctx.parents,
                // })

                models.add(
                    create({
                        name: modelName,
                        schema: value,
                        parentType,
                        parentPath,
                        parents: ctx.parents,
                    }),
                );

                return {
                    ...ctx,
                    parentPathSegments: [],
                    parents: [...ctx.parents, modelName],
                };
            };

            return {
                ...ctx,
                parentPathSegments,
            };
        });

    return [...models];
};

export const dependency = (model: ModelInstance, modelName: string): ModelInstance | undefined => {
    return flatten(model).find((m) => m.name === modelName);
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

export const referenceValue = (model: ModelInstance, ref: ModelReference): string => {
    return get(ref, REFERENCE_KEY(model.name));
};

export const referenceFor = (
    model: ModelInstance,
    ref: ModelReference,
    options: { withOwnReferenceKey?: boolean, includeNotFound?: boolean } = { includeNotFound: true },
): ModelReference => {
    const keys = referenceKeys(model);
    if (options?.withOwnReferenceKey) keys.unshift(REFERENCE_KEY(model.name));
    const pickedProperties = pick(ref, keys);
    return options.includeNotFound ? { ...(keys.reduce((acc, key) => ({ ...acc, [key]: undefined }), {})), ...pickedProperties } : pickedProperties;
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
        const isMatch = (model.schema as JSONSchemaMethods).isItemMatch?.(item, newItem);
        if (isMatch) return item;
    }
    return undefined;
};

export const connect = ({ api }: { api: GeneralStepApi }) => ({
    async organizeList(model: ModelInstance, items: TrailDataModelItem<ReallyAny>[]): Promise<{ valid: TrailDataModelItem[], invalid: TrailDataModelItem[] }> {
        const valid = await Promise.resolve((model.schema as JSONSchemaMethods)?.organizeList?.(items, api)) || items;
        const invalid = items.filter((item) => !valid.includes(item));
        return { valid, invalid };
    },
    async isListComplete(model: ModelInstance, items: TrailDataModelItem[]): Promise<boolean> {
        return Promise.resolve((model.schema as JSONSchemaMethods).isListComplete?.(items, api) || false);
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

export const schemaWithoutRequired = <T extends JSONSchema>(schema: T): T => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { required, ...rest } = ((schema || {}) as Record<string, ReallyAny>);
    return rest as T;
};

export default {
    create,
    define,
    dependency,
    dependencies,
    referenceKeys,
    referenceFor,
    referenceValue,
    find,
    validate,
    validateReference,
    connect,
    walk,
    flatten,
    schemaAsRaw,
    schemaWithoutRequired,
};
