"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.persist = exports.load = exports.create = exports.DefautFileStores = exports.DefaultDataStores = void 0;
const tslib_1 = require("tslib");
const data_store_1 = tslib_1.__importDefault(require("./data-store"));
const file_store_1 = tslib_1.__importDefault(require("./file-store"));
exports.DefaultDataStores = {
    state: data_store_1.default.create({ name: 'state', kvKey: 'STATE' }),
    trails: data_store_1.default.create({ name: 'trails', kvKey: 'TRAILS', splitByKey: true }),
    incorrectDataset: data_store_1.default.create({ name: 'incorrectDataset', kvKey: 'INCORRECT_DATASET' }),
};
exports.DefautFileStores = {
    files: file_store_1.default.create({ name: 'files', kvKey: 'FILES' }),
    responseBodies: file_store_1.default.create({ name: 'responseBodies', kvKey: 'RESPONSE_BODIES' }),
    browserTraces: file_store_1.default.create({ name: 'browserTraces', kvKey: 'BROWSER_TRACES' }),
};
// eslint-disable-next-line max-len
const create = (options) => {
    const { dataStoreNames = [], fileStoreNames = [] } = options || {};
    return {
        ...(dataStoreNames).reduce((stores, name) => ({
            ...stores,
            [name]: data_store_1.default.create({ name }),
        }), exports.DefaultDataStores),
        ...(fileStoreNames).reduce((stores, name) => ({
            ...stores,
            [name]: data_store_1.default.create({ name }),
        }), exports.DefautFileStores),
    };
};
exports.create = create;
const load = async (stores) => {
    if (!stores) {
        throw new Error('Stores are not defined');
    }
    const storesLoaded = await Promise.all(Object.values(stores).map(async (store) => {
        if (store.type === 'data-store') {
            return data_store_1.default.load(store);
        }
        if (store.type === 'file-store') {
            return file_store_1.default.load(store);
        }
        return Promise.resolve(store);
    }));
    return storesLoaded.reduce((acc, store) => {
        acc[store.name] = store;
        return acc;
    }, {});
};
exports.load = load;
const persist = async (stores) => {
    await Promise.allSettled(Object.values(stores)
        .map((store) => Promise.resolve(store.key === 'data-store'
        ? data_store_1.default.persist(store)
        : undefined)));
};
exports.persist = persist;
const listen = (stores) => {
    for (const store of Object.values(stores)) {
        if (store.key === 'data-store')
            data_store_1.default.listen(store);
    }
};
exports.listen = listen;
exports.default = { create: exports.create, load: exports.load, persist: exports.persist, listen: exports.listen, DefaultDataStores: exports.DefaultDataStores, DefautFileStores: exports.DefautFileStores };
//# sourceMappingURL=stores.js.map