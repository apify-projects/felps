import {
    DataStoreInstance, DefaultDataStoreNames, DefaultFileStoreNames,
    FileStoreInstance, GenerateObject, ReallyAny, StoreInstance, StoresInstance, StoresOptions,
} from './types';
import DataStore from './data-store';
import FileStore from './file-store';

export const DefaultDataStores: GenerateObject<DefaultDataStoreNames, DataStoreInstance> = {
    state: DataStore.create({ name: 'state', kvKey: 'state' }),
    trails: DataStore.create({ name: 'trails', kvKey: 'trails', splitByKey: true }),
    incorrectDataset: DataStore.create({ name: 'incorrectDataset', kvKey: 'incorrect-dataset' }),
};

export const DefautFileStores: & GenerateObject<DefaultFileStoreNames, FileStoreInstance> = {
    cachedRequests: FileStore.create({ name: 'files', kvKey: 'felps-cached-request' }),
    files: FileStore.create({ name: 'files', kvKey: 'felps-files' }),
    responseBodies: FileStore.create({ name: 'responseBodies', kvKey: 'felps-response-bodies' }),
    browserTraces: FileStore.create({ name: 'browserTraces', kvKey: 'felps-browser-traces' }),
};

// eslint-disable-next-line max-len
export const create = <DataStoreNames extends string[] = [], FileStoreNames extends string[] = []>(options?: StoresOptions<DataStoreNames, FileStoreNames>): StoresInstance<DataStoreNames, FileStoreNames> => {
    const { dataStoreNames = [], fileStoreNames = [] } = options || {};

    return {
        ...(dataStoreNames).reduce((stores, name) => ({
            ...stores,
            [name]: DataStore.create({ name }),
        }), DefaultDataStores),

        ...(fileStoreNames).reduce((stores, name) => ({
            ...stores,
            [name]: DataStore.create({ name }),
        }), DefautFileStores),
    };
};

export const load = async (stores: StoresInstance): Promise<StoresInstance> => {
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

export const persist = async (stores: StoresInstance): Promise<void> => {
    await Promise.allSettled(
        (Object.values(stores) as (DataStoreInstance | FileStoreInstance)[])
            .map((store) => Promise.resolve(
                store.key === 'data-store'
                    ? DataStore.persist(store as DataStoreInstance)
                    : undefined,
            )),
    );
};

export const listen = (stores: StoresInstance): void => {
    for (const store of Object.values(stores) as StoreInstance[]) {
        if (store.key === 'data-store') DataStore.listen(store as DataStoreInstance);
    }
};

export default { create, load, persist, listen, DefaultDataStores, DefautFileStores };
