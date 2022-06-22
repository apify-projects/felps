import * as CONST from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import Validator from '@usefelps/validator';
import * as utils from '@usefelps/utils';
import * as FT from '@usefelps/types';

export const create = (options: FT.ModelOptions): FT.ModelInstance<FT.JSONSchema> => {
    const { parentType, parentPath, parents = [] } = options;
    let { schema, name } = options;

    name = name || (schema as FT.JSONSchemaObject)?.modelName;
    schema = { modelName: name, ...schema as FT.JSONSchemaObject };

    return {
        ...Base.create({ name, key: 'model' }),
        schema,
        parentType,
        parentPath,
        parents,
    };
};

export const createKeyed = (options: FT.ModelOptions): { [name: FT.ModelOptions['name']]: FT.ModelInstance<FT.JSONSchema> } => {
    const instance = create(options);
    return { [instance.name]: instance };
};

export const define = <T extends FT.ModelDefinition<FT.JSONSchemaWithMethods>>(model: T): T => {
    return model as T;
};

export const walk = (model: FT.ModelInstance, walker: (key: string, value: FT.ReallyAny) => void): void => {
    utils.traverse(model.schema, walker);
};

export const flatten = (model: FT.ModelInstance): FT.ModelInstance[] => {
    const models = new Set<FT.ModelInstance>();
    utils.traverseAndCarry(
        model.schema,
        {
            parentPathSegments: [],
            parents: [],
        },
        (value, key, ctx) => {
            const parentPathSegments: string[] = [...ctx.parentPathSegments, key].filter(Boolean);
            if (CONST.SCHEMA_MODEL_NAME_KEY in value) {
                const modelName: string = value[CONST.SCHEMA_MODEL_NAME_KEY];
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

export const dependency = (model: FT.ModelInstance, modelName: string): FT.ModelInstance | undefined => {
    return flatten(model).find((m) => m.name === modelName);
};

export const dependencies = (model: FT.ModelInstance): FT.ModelInstance[] => {
    return flatten(model).filter((m) => m.name !== model.name);
};

export const referenceKeys = (model: FT.ModelInstance): FT.ReferenceKey[] => {
    return [
        CONST.TRAIL_KEY_PROP,
        ...(model.parents || []).map((key) => CONST.REFERENCE_KEY(key)),
    ];
};

export const referenceKeysSchema = (model: FT.ModelInstance): FT.JSONSchema => {
    const keys = referenceKeys(model);
    return {
        type: 'object',
        properties: keys.reduce((acc, key) => {
            acc[key] = { type: 'string' };
            return acc;
        }, {} as Record<string, FT.JSONSchema>),
        required: keys,
    };
};

export const referenceValue = (model: FT.ModelInstance, ref: FT.ModelReference): string => {
    return utils.get(ref, CONST.REFERENCE_KEY(model.name));
};

export const referenceFor = (
    model: FT.ModelInstance,
    ref: FT.ModelReference,
    options: { withOwnReferenceKey?: boolean, includeNotFound?: boolean } = { includeNotFound: true },
): FT.ModelReference => {
    const keys = referenceKeys(model);
    if (options?.withOwnReferenceKey) keys.unshift(CONST.REFERENCE_KEY(model.name));
    const pickedProperties = utils.pick(ref, keys);
    return options.includeNotFound ? { ...(keys.reduce((acc, key) => ({ ...acc, [key]: undefined }), {})), ...pickedProperties } : pickedProperties;
};

export const validate = <T = unknown>(model: FT.ModelInstance<FT.JSONSchema>, data: T, options: FT.ValidatorValidateOptions = {}) => {
    const validator = Validator.create({ name: model.name, schema: model.schema });
    return Validator.validate(validator, data, { partial: false, logError: true, throwError: false, ...options });
};

export const validateReference = <T = unknown>(model: FT.ModelInstance, ref: FT.ModelReference<T>, options: FT.ValidatorValidateOptions = {}) => {
    const validator = Validator.create({ name: model.name, schema: referenceKeysSchema(model) });
    return Validator.validate(validator, ref, { partial: false, logError: true, throwError: false, ...options });
};

export const find = (
    model: FT.ModelInstance, items: FT.TrailDataModelItem<FT.ReallyAny>[], newItem: FT.TrailDataModelItem<FT.ReallyAny>): FT.TrailDataModelItem<FT.ReallyAny> | undefined => {
    for (const item of items) {
        const isMatch = (model.schema as FT.JSONSchemaMethods).isItemMatch?.(item, newItem);
        if (isMatch) return item;
    }
    return undefined;
};

export const connect = ({ api }: { api: FT.GeneralContextApi }) => ({
    async organizeList(model: FT.ModelInstance, items: FT.TrailDataModelItem<FT.ReallyAny>[]): Promise<{ valid: FT.TrailDataModelItem[], invalid: FT.TrailDataModelItem[] }> {
        const valid = await Promise.resolve((model.schema as FT.JSONSchemaMethods)?.organizeList?.(items, api)) || items;
        const invalid = items.filter((item) => !valid.includes(item));
        return { valid, invalid };
    },
    async isListComplete(model: FT.ModelInstance, items: FT.TrailDataModelItem[]): Promise<boolean> {
        return Promise.resolve((model.schema as FT.JSONSchemaMethods).isListComplete?.(items, api) || false);
    },
});

export const schemaAsRaw = <T>(schema: T): T => {
    return JSON.parse(
        utils.stringify(schema, (key, value) => {
            if (key === 'modelName') return undefined;
            return value;
        }),
    );
};

export const schemaWithoutRequired = <T extends FT.JSONSchema>(schema: T): T => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { required, ...rest } = ((schema || {}) as Record<string, FT.ReallyAny>);
    return rest as T;
};

export default {
    create,
    createKeyed,
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
