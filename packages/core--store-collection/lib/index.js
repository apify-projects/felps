"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.persist = exports.load = exports.create = exports.DefautFileStores = exports.DefaultDataStores = void 0;
const tslib_1 = require("tslib");
const adapter__kv_store__apify_1 = tslib_1.__importDefault(require("@usefelps/adapter--kv-store--apify"));
const core__store__data_1 = tslib_1.__importDefault(require("@usefelps/core--store--data"));
const core__store__file_1 = tslib_1.__importDefault(require("@usefelps/core--store--file"));
exports.DefaultDataStores = [
    { name: 'state', kvKey: 'state' },
    { name: 'trails', kvKey: 'trails', splitByKey: true },
    { name: 'incorrectDataset', kvKey: 'incorrect-dataset' },
];
exports.DefautFileStores = [
    { name: 'files', kvKey: 'felps-cached-request' },
    { name: 'files', kvKey: 'felps-files' },
    { name: 'responseBodies', kvKey: 'felps-response-bodies' },
    { name: 'browserTraces', kvKey: 'felps-browser-traces' },
];
// eslint-disable-next-line max-len
const create = (options) => {
    const { dataStores = [], fileStores = [], dataStoreAdapter = (0, adapter__kv_store__apify_1.default)(),
    // fileStoreAdapter = ApifyKvStore(),
     } = options || {};
    return {
        ...([
            ...dataStores,
            ...exports.DefaultDataStores,
        ]).reduce((stores, store) => ({
            ...stores,
            [store.name]: core__store__data_1.default.create({
                ...store,
                adapter: dataStoreAdapter,
            }),
        }), {}),
        ...([
            ...fileStores,
            ...exports.DefautFileStores,
        ]).reduce((stores, store) => ({
            ...stores,
            [store.name]: core__store__file_1.default.create(store),
        }), {}),
    };
};
exports.create = create;
const load = async (stores) => {
    if (!stores) {
        throw new Error('Stores are not defined');
    }
    const storesLoaded = await Promise.all(Object.values(stores).map(async (store) => {
        if (store.type === 'data-store') {
            return core__store__data_1.default.load(store);
        }
        if (store.type === 'file-store') {
            return core__store__file_1.default.load(store);
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
        ? core__store__data_1.default.persist(store)
        : undefined)));
};
exports.persist = persist;
const listen = (stores) => {
    for (const store of Object.values(stores)) {
        if (store.key === 'data-store')
            core__store__data_1.default.listen(store);
    }
};
exports.listen = listen;
exports.default = { create: exports.create, load: exports.load, persist: exports.persist, listen: exports.listen, DefaultDataStores: exports.DefaultDataStores, DefautFileStores: exports.DefautFileStores };
//# sourceMappingURL=index.js.map