"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.persist = exports.load = exports.update = exports.setAndGetKey = exports.push = exports.shift = exports.pop = exports.decrement = exports.increment = exports.keys = exports.values = exports.entries = exports.has = exports.remove = exports.set = exports.get = exports.getPath = exports.create = void 0;
const tslib_1 = require("tslib");
const apify_1 = tslib_1.__importDefault(require("apify"));
const lodash_clonedeep_1 = tslib_1.__importDefault(require("lodash.clonedeep"));
const lodash_get_1 = tslib_1.__importDefault(require("lodash.get"));
const lodash_has_1 = tslib_1.__importDefault(require("lodash.has"));
// import omit from 'lodash.omit';
const ramda_1 = require("ramda");
const lodash_set_1 = tslib_1.__importDefault(require("lodash.set"));
const apify_events_1 = tslib_1.__importDefault(require("./apify-events"));
const base_1 = tslib_1.__importDefault(require("./base"));
const utils_1 = require("./utils");
const logger_1 = tslib_1.__importDefault(require("./logger"));
const mustBeLoaded = (store) => {
    if (!store.initialized) {
        throw new Error('Store must be loaded before using it');
    }
};
const create = (options) => {
    const { name, kvKey, key = 'data-store', splitByKey = false, pathPrefix = '' } = options || {};
    return {
        type: 'data-store',
        ...base_1.default.create({ key, name, id: `${key}-${name}${kvKey ? `-${kvKey}` : ''}` }),
        kvKey: kvKey || name,
        pathPrefix,
        splitByKey,
        initialized: false,
        state: {},
    };
};
exports.create = create;
const getPath = (dataStore, path) => {
    mustBeLoaded(dataStore);
    return [dataStore.pathPrefix, path].filter(Boolean).join('.');
};
exports.getPath = getPath;
const get = (dataStore, path) => {
    mustBeLoaded(dataStore);
    return (0, lodash_clonedeep_1.default)(path ? (0, lodash_get_1.default)(dataStore.state, (0, exports.getPath)(dataStore, path)) : dataStore.state);
};
exports.get = get;
const set = (dataStore, path, data) => {
    mustBeLoaded(dataStore);
    const p = (0, exports.getPath)(dataStore, path);
    (0, lodash_set_1.default)(dataStore.state, p, data);
};
exports.set = set;
const remove = (dataStore, path) => {
    mustBeLoaded(dataStore);
    dataStore.state = (0, ramda_1.dissocPath)((0, exports.getPath)(dataStore, path).split('.'), dataStore.state);
};
exports.remove = remove;
const has = (dataStore, path) => {
    mustBeLoaded(dataStore);
    return (0, lodash_has_1.default)(dataStore.state, (0, exports.getPath)(dataStore, path));
};
exports.has = has;
const entries = (dataStore, path) => {
    mustBeLoaded(dataStore);
    return Object.entries((0, exports.get)(dataStore, path));
};
exports.entries = entries;
const values = (dataStore, path) => {
    mustBeLoaded(dataStore);
    return Object.values((0, exports.get)(dataStore, path));
};
exports.values = values;
const keys = (dataStore, path) => {
    mustBeLoaded(dataStore);
    return Object.keys((0, exports.get)(dataStore, path));
};
exports.keys = keys;
const increment = (dataStore, path, stepNumber = 1) => {
    mustBeLoaded(dataStore);
    (0, exports.set)(dataStore, (0, exports.getPath)(dataStore, path), +((0, exports.get)(dataStore, (0, exports.getPath)(dataStore, path)) || 0) + stepNumber);
    return +(0, exports.get)(dataStore, (0, exports.getPath)(dataStore, path));
};
exports.increment = increment;
const decrement = (dataStore, path, stepNumber = 1) => {
    mustBeLoaded(dataStore);
    return (0, exports.increment)(dataStore, path, -stepNumber);
};
exports.decrement = decrement;
const pop = (dataStore, path) => {
    mustBeLoaded(dataStore);
    const items = (0, exports.get)(dataStore, (0, exports.getPath)(dataStore, path)) || [];
    const item = items.pop();
    (0, exports.set)(dataStore, (0, exports.getPath)(dataStore, path), items);
    return item;
};
exports.pop = pop;
const shift = (dataStore, path) => {
    mustBeLoaded(dataStore);
    const items = (0, exports.get)(dataStore, (0, exports.getPath)(dataStore, path)) || [];
    const item = items.shift();
    (0, exports.set)(dataStore, (0, exports.getPath)(dataStore, path), items);
    return item;
};
exports.shift = shift;
const push = (dataStore, path, ...data) => {
    mustBeLoaded(dataStore);
    (0, exports.set)(dataStore, (0, exports.getPath)(dataStore, path), [...((0, exports.get)(dataStore, (0, exports.getPath)(dataStore, path)) || []), ...data]);
};
exports.push = push;
const setAndGetKey = (dataStore, data) => {
    mustBeLoaded(dataStore);
    const path = (0, utils_1.craftUIDKey)();
    (0, exports.set)(dataStore, (0, exports.getPath)(dataStore, path), data);
    return path;
};
exports.setAndGetKey = setAndGetKey;
const update = (dataStore, path, data) => {
    mustBeLoaded(dataStore);
    const p = (0, exports.getPath)(dataStore, path);
    const original = (0, exports.get)(dataStore, p) || {};
    const merged = (0, ramda_1.mergeDeepRight)(original, data || {});
    (0, exports.set)(dataStore, path, merged);
};
exports.update = update;
const load = async (dataStore) => {
    if (!dataStore.initialized) {
        logger_1.default.start(logger_1.default.create(dataStore), 'Loading...');
        let state = {};
        const keyValueStore = await apify_1.default.openKeyValueStore();
        if (dataStore.splitByKey) {
            await keyValueStore.forEachKey(async (key) => {
                state[key] = await keyValueStore.getValue(key);
            }, { exclusiveStartKey: dataStore.kvKey });
        }
        else {
            state = (await apify_1.default.getValue(dataStore.kvKey) || {});
        }
        return {
            ...dataStore,
            initialized: true,
            state,
        };
    }
    return dataStore;
};
exports.load = load;
const persist = async (dataStore) => {
    mustBeLoaded(dataStore);
    if (dataStore.splitByKey) {
        await Promise.allSettled((0, exports.entries)(dataStore).map(([key, value]) => {
            return apify_1.default.setValue(`${dataStore.kvKey}-${key}`, value);
        }));
    }
    else {
        await apify_1.default.setValue(dataStore.kvKey, dataStore.state);
    }
    ;
};
exports.persist = persist;
const listen = (dataStore) => {
    apify_events_1.default.onAll(async () => {
        logger_1.default.info(logger_1.default.create(dataStore), 'Persisting store...');
        await (0, exports.persist)(dataStore);
    });
};
exports.listen = listen;
exports.default = { create: exports.create, get: exports.get, set: exports.set, remove: exports.remove, has: exports.has, entries: exports.entries, values: exports.values, keys: exports.keys, increment: exports.increment, decrement: exports.decrement, pop: exports.pop, shift: exports.shift, push: exports.push, setAndGetKey: exports.setAndGetKey, update: exports.update, load: exports.load, persist: exports.persist, listen: exports.listen };
//# sourceMappingURL=data-store.js.map