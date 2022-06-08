"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.persist = exports.load = exports.update = exports.setAndGetKey = exports.push = exports.shift = exports.pop = exports.decrement = exports.increment = exports.keys = exports.values = exports.entries = exports.has = exports.remove = exports.set = exports.get = exports.getPath = exports.create = void 0;
const tslib_1 = require("tslib");
const apify__events_1 = tslib_1.__importDefault(require("@usefelps/apify--events"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const adapter__kv_store_1 = tslib_1.__importDefault(require("@usefelps/adapter--kv-store"));
const helper__logger_1 = tslib_1.__importDefault(require("@usefelps/helper--logger"));
const utils = tslib_1.__importStar(require("@usefelps/helper--utils"));
const mustBeLoaded = (store) => {
    if (!store.initialized) {
        throw new Error('Store must be loaded before using it');
    }
};
const create = (options) => {
    const { adapter, name, kvKey, key = 'data-store', splitByKey = false, pathPrefix = '' } = options || {};
    return {
        type: 'data-store',
        adapter,
        ...core__instance_base_1.default.create({ key, name, id: `${key}-${name}${kvKey ? `-${kvKey}` : ''}` }),
        kvKey: kvKey || name,
        pathPrefix,
        splitByKey,
        initialized: false,
        state: {},
        stats: { reads: 0, writes: 0 },
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
    return utils.clone(path ? utils.get(dataStore.state, (0, exports.getPath)(dataStore, path)) : dataStore.state);
};
exports.get = get;
const set = (dataStore, path, data) => {
    mustBeLoaded(dataStore);
    const p = (0, exports.getPath)(dataStore, path);
    utils.set(dataStore.state, p, data);
};
exports.set = set;
const remove = (dataStore, path) => {
    mustBeLoaded(dataStore);
    utils.unset(dataStore.state, (0, exports.getPath)(dataStore, path).split('.'));
};
exports.remove = remove;
const has = (dataStore, path) => {
    mustBeLoaded(dataStore);
    return utils.has(dataStore.state, (0, exports.getPath)(dataStore, path));
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
    const path = utils.craftUIDKey();
    (0, exports.set)(dataStore, (0, exports.getPath)(dataStore, path), data);
    return path;
};
exports.setAndGetKey = setAndGetKey;
const update = (dataStore, path, data) => {
    mustBeLoaded(dataStore);
    const p = (0, exports.getPath)(dataStore, path);
    const original = (0, exports.get)(dataStore, p) || {};
    const merged = utils.merge(original, data || {});
    (0, exports.set)(dataStore, path, merged);
};
exports.update = update;
const load = async (dataStore) => {
    if (!dataStore.initialized) {
        helper__logger_1.default.start(helper__logger_1.default.create(dataStore), 'Loading...');
        let state = {};
        const connected = await adapter__kv_store_1.default.load(dataStore.adapter);
        if (dataStore.splitByKey) {
            const currentKeys = await adapter__kv_store_1.default.list(connected, dataStore.kvKey);
            for (const { key } of currentKeys.keys) {
                dataStore.stats.reads++;
                state[key] = await adapter__kv_store_1.default.get(connected, key) || {};
            }
        }
        else {
            dataStore.stats.reads++;
            state = await adapter__kv_store_1.default.get(connected, dataStore.kvKey) || {};
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
            dataStore.stats.writes++;
            return adapter__kv_store_1.default.set(dataStore.adapter, `${dataStore.kvKey}-${key}`, value);
        }));
    }
    else {
        await adapter__kv_store_1.default.set(dataStore.adapter, dataStore.kvKey, dataStore.state);
    }
    ;
    helper__logger_1.default.info(helper__logger_1.default.create(dataStore), 'Persisting store...', { stats: dataStore.stats });
};
exports.persist = persist;
const listen = (dataStore) => {
    apify__events_1.default.onAll(async () => {
        await (0, exports.persist)(dataStore);
    });
};
exports.listen = listen;
exports.default = { create: exports.create, get: exports.get, set: exports.set, remove: exports.remove, has: exports.has, entries: exports.entries, values: exports.values, keys: exports.keys, increment: exports.increment, decrement: exports.decrement, pop: exports.pop, shift: exports.shift, push: exports.push, setAndGetKey: exports.setAndGetKey, update: exports.update, load: exports.load, persist: exports.persist, listen: exports.listen };
//# sourceMappingURL=index.js.map