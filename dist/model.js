"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaAsRaw = exports.connect = exports.find = exports.validateReference = exports.validate = exports.referenceFor = exports.referenceValue = exports.referenceKeysSchema = exports.referenceKeys = exports.dependencies = exports.dependency = exports.flatten = exports.walk = exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
const fast_safe_stringify_1 = tslib_1.__importDefault(require("fast-safe-stringify"));
const lodash_get_1 = tslib_1.__importDefault(require("lodash.get"));
const ramda_1 = require("ramda");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const utils_1 = require("./utils");
const validator_1 = tslib_1.__importDefault(require("./validator"));
const create = (options) => {
    const { parentType, parentPath, parents = [] } = options;
    let { schema, name } = options;
    name = name || schema?.modelName;
    schema = { modelName: name, ...schema };
    return {
        ...base_1.default.create({ name, key: 'model' }),
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
    (0, utils_1.traverse)(model.schema, walker);
};
exports.walk = walk;
const flatten = (model) => {
    const models = new Set();
    (0, utils_1.traverseAndCarry)(model.schema, {
        parentPathSegments: [],
        parents: [],
    }, (value, key, ctx) => {
        const parentPathSegments = [...ctx.parentPathSegments, key].filter(Boolean);
        if (consts_1.SCHEMA_MODEL_NAME_KEY in value) {
            const modelName = value[consts_1.SCHEMA_MODEL_NAME_KEY];
            const parentType = parentPathSegments.slice(-1)[0] === 'items' ? 'array' : value.type;
            // TO BE OPTIMIZED
            // ttems or properties could well be valid object keys as well
            const parentPath = parentPathSegments.filter((segment) => !['items', 'properties'].includes(segment)).join('.');
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
        consts_1.TRAIL_KEY_PROP,
        ...(model.parents || []).map((key) => (0, consts_1.REFERENCE_KEY)(key)),
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
    return (0, lodash_get_1.default)(ref, (0, consts_1.REFERENCE_KEY)(model.name));
};
exports.referenceValue = referenceValue;
const referenceFor = (model, ref, withOwnReferenceKey) => {
    const keys = (0, exports.referenceKeys)(model);
    if (withOwnReferenceKey)
        keys.unshift((0, consts_1.REFERENCE_KEY)(model.name));
    return (0, ramda_1.pickAll)(keys, ref);
};
exports.referenceFor = referenceFor;
const validate = (model, data, options = {}) => {
    const validator = validator_1.default.create({ name: model.name, schema: model.schema });
    return validator_1.default.validate(validator, data, { partial: false, logError: true, throwError: false, ...options });
};
exports.validate = validate;
const validateReference = (model, ref, options = {}) => {
    const validator = validator_1.default.create({ name: model.name, schema: (0, exports.referenceKeysSchema)(model) });
    return validator_1.default.validate(validator, ref, { partial: false, logError: true, throwError: false, ...options });
};
exports.validateReference = validateReference;
const find = (model, items, newItem) => {
    for (const item of items) {
        if (model.schema.isItemUnique?.(item, newItem))
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
        return model.schema.isListComplete?.(items, api) || false;
    },
});
exports.connect = connect;
const schemaAsRaw = (schema) => {
    return JSON.parse((0, fast_safe_stringify_1.default)(schema, (key, value) => {
        if (key === 'modelName')
            return undefined;
        return value;
    }));
};
exports.schemaAsRaw = schemaAsRaw;
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
};
//# sourceMappingURL=model.js.map