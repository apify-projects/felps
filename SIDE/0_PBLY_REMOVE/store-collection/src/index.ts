import ApifyKvStore from '@usefelps/kv-store--adapter--apify';
import State from '@usefelps/state';
import Bucket from '@usefelps/bucket';
import { StateInstance, BucketInstance, ReallyAny, StoreCollectionInstance, StoreCollectionOptions, StoreInstance } from '@usefelps/types';

export const DefaultStates = [
    { name: 'state', kvKey: 'state' },
    { name: 'trails', kvKey: 'trails', splitByKey: true },
    { name: 'incorrectDataset', kvKey: 'incorrect-dataset' },
];

export const DefautBuckets = [
    { name: 'files', kvKey: 'felps-cached-request' },
    { name: 'files', kvKey: 'felps-files' },
    { name: 'responseBodies', kvKey: 'felps-response-bodies' },
    { name: 'browserTraces', kvKey: 'felps-browser-traces' },
];

// eslint-disable-next-line max-len
export const create = (options?: StoreCollectionOptions): StoreCollectionInstance => {
    const {
        dataStores = [],
        Buckets = [],
        dataStoreAdapter = ApifyKvStore(),
        // BucketAdapter = ApifyKvStore(),
    } = options || {};

    return {
        ...([
            ...dataStores,
            ...DefaultStates,
        ]).reduce((stores, store) => ({
            ...stores,
            [store.name]: State.create({
                ...store,
                adapter: dataStoreAdapter,
            }),
        }), {}),

        ...([
            ...Buckets,
            ...DefautBuckets,
        ]).reduce((stores, store) => ({
            ...stores,
            [store.name]: Bucket.create(store),
        }), {}),
    } as StoreCollectionInstance;
};

export const load = async (stores: StoreCollectionInstance): Promise<StoreCollectionInstance> => {
    if (!stores) {
        throw new Error('Stores are not defined');
    }

    const storesLoaded = await Promise.all(
        Object.values(stores as Record<string, StoreInstance>).map(async (store) => {
            if (store.type === 'state') {
                return State.load(store as StateInstance);
            }
            if (store.type === 'bucket') {
                return Bucket.load(store as BucketInstance);
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
        (Object.values(stores) as (StateInstance | BucketInstance)[])
            .map((store) => Promise.resolve(
                store.key === 'state'
                    ? State.persist(store as StateInstance)
                    : undefined,
            )),
    );
};

export const listen = (stores: StoreCollectionInstance): void => {
    for (const store of Object.values(stores) as StoreInstance[]) {
        if (store.key === 'state') State.listen(store as StateInstance);
    }
};

export default { create, load, persist, listen, DefaultStates, DefautBuckets };
