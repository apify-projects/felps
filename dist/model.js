"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.find = exports.validateReference = exports.validate = exports.referenceFor = exports.referenceKeysSchema = exports.referenceKeys = exports.dependencies = exports.flatten = exports.walk = exports.wrap = exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
const ramda_1 = require("ramda");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const utils_1 = require("./utils");
const validator_1 = tslib_1.__importDefault(require("./validator"));
const create = (options) => {
    const { parents = [] } = options;
    let { schema, name } = options;
    name = name || schema?.modelName;
    schema = { modelName: name, ...schema };
    return (0, exports.wrap)({
        ...base_1.default.create({ name, key: 'model' }),
        schema,
        parents,
    });
};
exports.create = create;
const define = (model) => {
    return model;
};
exports.define = define;
const wrap = (model) => {
    return new Proxy(model, {
        get: (target, prop) => {
            if (prop === 'schema') {
                return {
                    ...target.schema,
                    [consts_1.SCHEMA_MODEL_NAME_KEY]: model.name,
                };
            }
            return target[prop];
        },
    });
};
exports.wrap = wrap;
const walk = (model, walker) => {
    (0, utils_1.traverse)(model.schema, walker);
};
exports.walk = walk;
const flatten = (model) => {
    const models = new Set();
    (0, utils_1.traverseAndCarry)(model.schema, { parents: [] }, (value, ctx) => {
        const modelName = value[consts_1.SCHEMA_MODEL_NAME_KEY];
        if (modelName) {
            models.add((0, exports.create)({
                name: modelName,
                schema: value,
                parents: ctx.parents,
            }));
            return {
                parents: [...ctx.parents, modelName],
            };
        }
        return ctx;
    });
    return [...models];
};
exports.flatten = flatten;
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
const referenceFor = (model, ref, withOwnReferenceKey) => {
    const keys = (0, exports.referenceKeys)(model);
    if (withOwnReferenceKey)
        keys.unshift((0, consts_1.REFERENCE_KEY)(model.name));
    return (0, ramda_1.pickAll)(keys, ref);
};
exports.referenceFor = referenceFor;
// export const match = (model: ModelInstance, ref: ModelReference): boolean => {
//     return Object.values(referenceFor(model, ref, true)).every((value) => value !== undefined);
// };
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
exports.default = { create: exports.create, define: exports.define, dependencies: exports.dependencies, referenceKeys: exports.referenceKeys, referenceFor: exports.referenceFor, find: exports.find, validate: exports.validate, validateReference: exports.validateReference, connect: exports.connect, wrap: exports.wrap, walk: exports.walk, flatten: exports.flatten };
//# sourceMappingURL=model.js.map