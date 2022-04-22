import {
    DataStoreInstance, DefaultDataStoreNames, DefaultFileStoreNames,
    FileStoreInstance, GenerateObject, StoreInstance, StoresInstance, StoresOptions,
} from './common/types';
import DataStore from './data-store';
import FileStore from './file-store';

export const DefaultDataStores: GenerateObject<DefaultDataStoreNames, DataStoreInstance> = {
    state: DataStore.create({ name: 'state', kvKey: 'STATE' }),
    trails: DataStore.create({ name: 'trails', kvKey: 'TRAILS' }),
    incorrectDataset: DataStore.create({ name: 'incorrectDataset', kvKey: 'INCORRECT_DATASET' }),
};

export const DefautFileStores: & GenerateObject<DefaultFileStoreNames, FileStoreInstance> = {
    files: FileStore.create({ name: 'files', kvKey: 'FILES' }),
    responseBodies: FileStore.create({ name: 'responseBodies', kvKey: 'RESPONSE_BODIES' }),
    browserTraces: FileStore.create({ name: 'browserTraces', kvKey: 'BROWSER_TRACES' }),
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

    return storesLoaded.reduce<Record<string, StoreInstance>>((acc, store: StoreInstance) => {
        acc[store.name] = store;
        return acc;
    }, {});
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
