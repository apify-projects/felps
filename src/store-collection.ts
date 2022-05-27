import ApifyKvStore from './adapters/apify-kv-store';
import DataStore from './data-store';
import FileStore from './file-store';
import {
    DataStoreInstance, FileStoreInstance, ReallyAny, StoreCollectionInstance, StoreCollectionOptions, StoreInstance,
} from './types';

export const DefaultDataStores = [
    { name: 'state', kvKey: 'state' },
    { name: 'trails', kvKey: 'trails', splitByKey: true },
    { name: 'incorrectDataset', kvKey: 'incorrect-dataset' },
];

export const DefautFileStores = [
    { name: 'files', kvKey: 'felps-cached-request' },
    { name: 'files', kvKey: 'felps-files' },
    { name: 'responseBodies', kvKey: 'felps-response-bodies' },
    { name: 'browserTraces', kvKey: 'felps-browser-traces' },
];

// eslint-disable-next-line max-len
export const create = (options?: StoreCollectionOptions): StoreCollectionInstance => {
    const {
        dataStores = [],
        fileStores = [],
        dataStoreAdapter = ApifyKvStore(),
        // fileStoreAdapter = ApifyKvStore(),
    } = options || {};

    return {
        ...([
            ...dataStores,
            ...DefaultDataStores,
        ]).reduce((stores, store) => ({
            ...stores,
            [store.name]: DataStore.create({
                ...store,
                adapter: dataStoreAdapter,
            }),
        }), {}),

        ...([
            ...fileStores,
            ...DefautFileStores,
        ]).reduce((stores, store) => ({
            ...stores,
            [store.name]: FileStore.create(store),
        }), {}),
    } as StoreCollectionInstance;
};

export const load = async (stores: StoreCollectionInstance): Promise<StoreCollectionInstance> => {
    if (!stores) {
        throw new Error('Stores are not defined');
    }

    const storesLoaded = await Promise.all(
        Object.values(stores as Record<string, StoreInstance>).map(async (store) => {
            if (store.type === 'data-store') {
                return DataStore.load(store as DataStoreInstance);
            }
            if (store.type === 'file-store') {
                return FileStore.load(store as FileStoreInstance);
            }
            return Promise.resolve(store);
        }),
    ) as StoreInstance[];

    return storesLoaded.reduce((acc, store: StoreInstance) => {
        acc[store.name] = store;
        return acc;
    }, {} as ReallyAny);
};

export const persist = async (stores: StoreCollectionInstance): Promise<void> => {
    await Promise.allSettled(
        (Object.values(stores) as (DataStoreInstance | FileStoreInstance)[])
            .map((store) => Promise.resolve(
                store.key === 'data-store'
                    ? DataStore.persist(store as DataStoreInstance)
                    : undefined,
            )),
    );
};

export const listen = (stores: StoreCollectionInstance): void => {
    for (const store of Object.values(stores) as StoreInstance[]) {
        if (store.key === 'data-store') DataStore.listen(store as DataStoreInstance);
    }
};

export default { create, load, persist, listen, DefaultDataStores, DefautFileStores };
