"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.everyAsync = exports.someAsync = exports.traverseAndCarry = exports.traverse = exports.orderByClosestLength = exports.concatAsUniqueArray = exports.isNumberPredicate = exports.difference = exports.intersect = exports.pathify = exports.resolveUrl = exports.randomNumberBetween = exports.extendRequest = exports.keyedObjectToArray = exports.arrayToKeyedObject = exports.compareUIDKeysFromLast = exports.compareUIDKeysFromFirst = exports.getUIDKeyTime = exports.craftUIDKey = exports.craftUID = exports.stringify = exports.pick = exports.isMatch = exports.unset = exports.set = exports.has = exports.get = exports.clone = exports.hash = exports.merge = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const nanoid_1 = require("nanoid");
const fast_safe_stringify_1 = tslib_1.__importDefault(require("fast-safe-stringify"));
const lodash_clonedeep_1 = tslib_1.__importDefault(require("lodash.clonedeep"));
const lodash_pick_1 = tslib_1.__importDefault(require("lodash.pick"));
const lodash_get_1 = tslib_1.__importDefault(require("lodash.get"));
const lodash_has_1 = tslib_1.__importDefault(require("lodash.has"));
const lodash_set_1 = tslib_1.__importDefault(require("lodash.set"));
const lodash_unset_1 = tslib_1.__importDefault(require("lodash.unset"));
const lodash_ismatch_1 = tslib_1.__importDefault(require("lodash.ismatch"));
const node_url_1 = require("node:url");
const core__constants_1 = require("@usefelps/core--constants");
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const merge_deep_1 = tslib_1.__importDefault(require("merge-deep"));
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
exports.merge = merge_deep_1.default;
exports.hash = object_hash_1.default;
exports.clone = lodash_clonedeep_1.default;
exports.get = lodash_get_1.default;
exports.has = lodash_has_1.default;
exports.set = lodash_set_1.default;
exports.unset = lodash_unset_1.default;
exports.isMatch = lodash_ismatch_1.default;
exports.pick = lodash_pick_1.default;
exports.stringify = fast_safe_stringify_1.default;
exports.craftUID = (0, nanoid_1.customAlphabet)(alphabet, 4);
// eslint-disable-next-line max-len
const craftUIDKey = (prefix, uidLength = core__constants_1.UID_KEY_LENGTH) => `${prefix || core__constants_1.UID_KEY_PREFIX}_${(0, nanoid_1.customAlphabet)(alphabet, uidLength)()}${new Date().getTime().toString(36)}`;
exports.craftUIDKey = craftUIDKey;
const getUIDKeyTime = (key) => parseInt(key.split('_').reverse()[0].slice(core__constants_1.UID_KEY_LENGTH), 36);
exports.getUIDKeyTime = getUIDKeyTime;
const compareUIDKeysFromFirst = (a, b) => (0, exports.getUIDKeyTime)(a) - (0, exports.getUIDKeyTime)(b);
exports.compareUIDKeysFromFirst = compareUIDKeysFromFirst;
const compareUIDKeysFromLast = (a, b) => (0, exports.getUIDKeyTime)(b) - (0, exports.getUIDKeyTime)(a);
exports.compareUIDKeysFromLast = compareUIDKeysFromLast;
const arrayToKeyedObject = (arr) => arr
    .reduce((acc, item) => {
    acc[(0, exports.craftUIDKey)()] = item;
    return acc;
}, {});
exports.arrayToKeyedObject = arrayToKeyedObject;
const keyedObjectToArray = (keyedObject) => Object.values(keyedObject)
    .reduce((acc, item) => {
    acc.push(item);
    return acc;
}, []);
exports.keyedObjectToArray = keyedObjectToArray;
const extendRequest = (request, userData) => {
    return {
        ...(request || {}),
        userData: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(request?.userData || {}),
            ...(userData || {}),
        },
    };
};
exports.extendRequest = extendRequest;
const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomNumberBetween = randomNumberBetween;
const resolveUrl = (absoluteUrl, relativeUrl) => {
    if (relativeUrl === undefined)
        return undefined;
    try {
        const link = new node_url_1.URL(absoluteUrl, relativeUrl);
        return link.href;
    }
    catch (error) {
        return undefined;
        // fail silently, return undefined
    }
};
exports.resolveUrl = resolveUrl;
const pathify = (...args) => args.filter(Boolean).join('.');
exports.pathify = pathify;
const intersect = (arrayA, arrayB) => arrayA.filter((item) => arrayB.includes(item));
exports.intersect = intersect;
const difference = (arrayA, arrayB) => arrayA.filter((item) => !arrayB.includes(item));
exports.difference = difference;
const isNumberPredicate = (nb) => !Number.isNaN(+nb);
exports.isNumberPredicate = isNumberPredicate;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const concatAsUniqueArray = (...arrs) => [...new Set([].concat(...arrs.filter((item) => Array.isArray(item))))];
exports.concatAsUniqueArray = concatAsUniqueArray;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const orderByClosestLength = (text, list, matcher = (item) => item) => {
    const { length } = text;
    const distances = new Map();
    for (const item of list) {
        const distance = Math.abs(length - matcher(item).length);
        if (distances.get(distance)) {
            distances.set(distance, [...distances.get(distance), item]);
        }
        else {
            distances.set(distance, [item]);
        }
    }
    const orderedDistances = Array.from(distances.keys()).sort((a, b) => +a - +b);
    const orderedItems = orderedDistances.reduce((acc, distance) => {
        acc.push(...distances.get(distance));
        return acc;
    }, []);
    return orderedItems;
};
exports.orderByClosestLength = orderByClosestLength;
const traverse = (obj, handler) => {
    for (const k of Object.keys(obj)) {
        handler(k, obj);
        if (obj.hasOwnProperty(k) && obj[k] && typeof obj[k] === 'object') {
            (0, exports.traverse)(obj[k], handler);
        }
        else {
            // Do something with obj[k]
        }
    }
};
exports.traverse = traverse;
const traverseAndCarry = (obj, context, handler, key) => {
    context = handler(obj, key, (0, lodash_clonedeep_1.default)(context)) || context;
    for (const k of Object.keys(obj)) {
        if (obj.hasOwnProperty(k) && obj[k] && typeof obj[k] === 'object') {
            (0, exports.traverseAndCarry)(obj[k], (0, lodash_clonedeep_1.default)(context), handler, k);
        }
        else {
            // Do something with obj[k]
        }
    }
};
exports.traverseAndCarry = traverseAndCarry;
const someAsync = async (arr, predicate) => {
    for (const e of arr) {
        if (await predicate(e))
            return true;
    }
    return false;
};
exports.someAsync = someAsync;
const everyAsync = async (arr, predicate) => {
    for (const e of arr) {
        if (!await predicate(e))
            return false;
    }
    return true;
};
exports.everyAsync = everyAsync;
//# sourceMappingURL=index.js.map