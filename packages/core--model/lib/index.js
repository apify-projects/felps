"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaWithoutRequired = exports.schemaAsRaw = exports.connect = exports.find = exports.validateReference = exports.validate = exports.referenceFor = exports.referenceValue = exports.referenceKeysSchema = exports.referenceKeys = exports.dependencies = exports.dependency = exports.flatten = exports.walk = exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__validator_1 = tslib_1.__importDefault(require("@usefelps/core--validator"));
const utils = tslib_1.__importStar(require("@usefelps/helper--utils"));
const create = (options) => {
    const { parentType, parentPath, parents = [] } = options;
    let { schema, name } = options;
    name = name || schema?.modelName;
    schema = { modelName: name, ...schema };
    return {
        ...core__instance_base_1.default.create({ name, key: 'model' }),
        schema,
        parentType,
        parentPath,
        parents,
    };
};
exports.create = create;
const define = (model) => {
    return model;
};
exports.define = define;
const walk = (model, walker) => {
    utils.traverse(model.schema, walker);
};
exports.walk = walk;
const flatten = (model) => {
    const models = new Set();
    utils.traverseAndCarry(model.schema, {
        parentPathSegments: [],
        parents: [],
    }, (value, key, ctx) => {
        const parentPathSegments = [...ctx.parentPathSegments, key].filter(Boolean);
        if (CONST.SCHEMA_MODEL_NAME_KEY in value) {
            const modelName = value[CONST.SCHEMA_MODEL_NAME_KEY];
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
            models.add((0, exports.create)({
                name: modelName,
                schema: value,
                parentType,
                parentPath,
                parents: ctx.parents,
            }));
            return {
                ...ctx,
                parentPathSegments: [],
                parents: [...ctx.parents, modelName],
            };
        }
        ;
        return {
            ...ctx,
            parentPathSegments,
        };
    });
    return [...models];
};
exports.flatten = flatten;
const dependency = (model, modelName) => {
    return (0, exports.flatten)(model).find((m) => m.name === modelName);
};
exports.dependency = dependency;
const dependencies = (model) => {
    return (0, exports.flatten)(model).filter((m) => m.name !== model.name);
};
exports.dependencies = dependencies;
const referenceKeys = (model) => {
    return [
        CONST.TRAIL_KEY_PROP,
        ...(model.parents || []).map((key) => CONST.REFERENCE_KEY(key)),
    ];
};
exports.referenceKeys = referenceKeys;
const referenceKeysSchema = (model) => {
    const keys = (0, exports.referenceKeys)(model);
    return {
        type: 'object',
        properties: keys.reduce((acc, key) => {
            acc[key] = { type: 'string' };
            return acc;
        }, {}),
        required: keys,
    };
};
exports.referenceKeysSchema = referenceKeysSchema;
const referenceValue = (model, ref) => {
    return utils.get(ref, CONST.REFERENCE_KEY(model.name));
};
exports.referenceValue = referenceValue;
const referenceFor = (model, ref, options = { includeNotFound: true }) => {
    const keys = (0, exports.referenceKeys)(model);
    if (options?.withOwnReferenceKey)
        keys.unshift(CONST.REFERENCE_KEY(model.name));
    const pickedProperties = utils.pick(ref, keys);
    return options.includeNotFound ? { ...(keys.reduce((acc, key) => ({ ...acc, [key]: undefined }), {})), ...pickedProperties } : pickedProperties;
};
exports.referenceFor = referenceFor;
const validate = (model, data, options = {}) => {
    const validator = core__validator_1.default.create({ name: model.name, schema: model.schema });
    return core__validator_1.default.validate(validator, data, { partial: false, logError: true, throwError: false, ...options });
};
exports.validate = validate;
const validateReference = (model, ref, options = {}) => {
    const validator = core__validator_1.default.create({ name: model.name, schema: (0, exports.referenceKeysSchema)(model) });
    return core__validator_1.default.validate(validator, ref, { partial: false, logError: true, throwError: false, ...options });
};
exports.validateReference = validateReference;
const find = (model, items, newItem) => {
    for (const item of items) {
        const isMatch = model.schema.isItemMatch?.(item, newItem);
        if (isMatch)
            return item;
    }
    return undefined;
};
exports.find = find;
const connect = ({ api }) => ({
    async organizeList(model, items) {
        const valid = await Promise.resolve(model.schema?.organizeList?.(items, api)) || items;
        const invalid = items.filter((item) => !valid.includes(item));
        return { valid, invalid };
    },
    async isListComplete(model, items) {
        return Promise.resolve(model.schema.isListComplete?.(items, api) || false);
    },
});
exports.connect = connect;
const schemaAsRaw = (schema) => {
    return JSON.parse(utils.stringify(schema, (key, value) => {
        if (key === 'modelName')
            return undefined;
        return value;
    }));
};
exports.schemaAsRaw = schemaAsRaw;
const schemaWithoutRequired = (schema) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { required, ...rest } = (schema || {});
    return rest;
};
exports.schemaWithoutRequired = schemaWithoutRequired;
exports.default = {
    create: exports.create,
    define: exports.define,
    dependency: exports.dependency,
    dependencies: exports.dependencies,
    referenceKeys: exports.referenceKeys,
    referenceFor: exports.referenceFor,
    referenceValue: exports.referenceValue,
    find: exports.find,
    validate: exports.validate,
    validateReference: exports.validateReference,
    connect: exports.connect,
    walk: exports.walk,
    flatten: exports.flatten,
    schemaAsRaw: exports.schemaAsRaw,
    schemaWithoutRequired: exports.schemaWithoutRequired,
};
//# sourceMappingURL=index.js.map