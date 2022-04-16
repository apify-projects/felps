import {
    DataStoreInstance, DefaultDataStoreNames, DefaultFileStoreNames,
    FileStoreInstance, GenerateObject, StoresInstance, StoresOptions,
} from '../common/types';
import dataStore from './data-store';
import fileStore from './file-store';

export const DefaultDataStores: GenerateObject<DefaultDataStoreNames, DataStoreInstance> = {
    state: dataStore.create({ name: 'state' }),
    trails: dataStore.create({ name: 'trails' }),
    incorrectDataset: dataStore.create({ name: 'incorrectDataset' }),
};

export const DefautFileStores: & GenerateObject<DefaultFileStoreNames, FileStoreInstance> = {
    files: fileStore.create({ name: 'files' }),
    responseBodies: fileStore.create({ name: 'responseBodies' }),
    browserTraces: fileStore.create({ name: 'browserTraces' }),
};

// eslint-disable-next-line max-len
export const create = <DataStoreNames extends string[] = [], FileStoreNames extends string[] = []>(options?: StoresOptions<DataStoreNames, FileStoreNames>): StoresInstance<DataStoreNames, FileStoreNames> => {
    const { dataStoreNames = [], fileStoreNames = [] } = options || {};

    return {
        ...(dataStoreNames).reduce((stores, name) => ({
            ...stores,
            [name]: dataStore.create({ name }),
        }), DefaultDataStores),

        ...(fileStoreNames).reduce((stores, name) => ({
            ...stores,
            [name]: dataStore.create({ name }),
        }), DefautFileStores),
    };
};

export const persist = async (stores: StoresInstance): Promise<void> => {
    await Promise.allSettled(
        (Object.values(stores) as (DataStoreInstance | FileStoreInstance)[])
            .map((store) => Promise.resolve(
                store.key === 'data-store'
                    ? dataStore.persist(store as DataStoreInstance)
                    : undefined,
            )),
    );
};

export default { create, persist, DefaultDataStores, DefautFileStores };
