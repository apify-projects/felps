import Apify from 'apify';
import cloneDeep from 'lodash.clonedeep';
import getByKey from 'lodash.get';
import hasByPath from 'lodash.has';
import mergeWith from 'lodash.mergewith';
import setByKey from 'lodash.set';
import { curry, curryN } from 'rambda';
import base from './base';
import logger from './logger';
import { DataStoreInstance, DataStoreOptions } from '../common/types';
import { craftUIDKey } from '../common/utils';

export const create = (options?: DataStoreOptions): DataStoreInstance => {
    const { name, kvKey, key = 'data-store', pathPrefix = '' } = options || {};

    return {
        ...base.create({ key, name, id: `${key}-${name}${kvKey ? `-${kvKey}` : ''}` }),
        kvKey,
        pathPrefix,
        initialized: false,
        store: {},
    };
};

export const getPath = curryN(2, (dataStore: DataStoreInstance, path: string): string => {
    return [dataStore.pathPrefix, path].filter(Boolean).join('.');
});

export const get = curryN(2, (dataStore: DataStoreInstance, path: string): unknown => {
    return cloneDeep(path ? getByKey(dataStore.store, getPath(dataStore, path)) : dataStore.store);
});

export const set = curryN(3, (dataStore: DataStoreInstance, path: string, data: unknown): void => {
    setByKey(dataStore.store, getPath(dataStore, path), data);
});

export const has = curryN(2, (dataStore: DataStoreInstance, path: string): void => {
    hasByPath(dataStore.store, getPath(dataStore, path));
});

export const increment = curryN(3, (dataStore: DataStoreInstance, path: string, stepNumber = 1): number => {
    set(dataStore, getPath(dataStore, path), +(get(dataStore, getPath(dataStore, path)) || 0) + stepNumber);
    return get(dataStore, getPath(dataStore, path));
});

export const decrement = curryN(3, (dataStore: DataStoreInstance, path: string, stepNumber = 1): number => {
    return increment(dataStore, path, -stepNumber);
});

export const pop = curryN(2, (dataStore: DataStoreInstance, path: string): unknown => {
    const items = get(dataStore, getPath(dataStore, path)) || [];
    const item = items.pop();
    set(dataStore, getPath(dataStore, path), items);
    return item;
});

export const shift = curryN(2, (dataStore: DataStoreInstance, path: string): unknown => {
    const items = get(dataStore, getPath(dataStore, path)) || [];
    const item = items.shift();
    set(dataStore, getPath(dataStore, path), items);
    return item;
});

export const push = curryN(3, (dataStore: DataStoreInstance, path: string, data: unknown): void => {
    set(dataStore, getPath(dataStore, path), [...(get(dataStore, getPath(dataStore, path)) || []), data]);
});

export const setAndGetKey = curryN(2, (dataStore: DataStoreInstance, data: unknown): string => {
    const path = craftUIDKey();
    set(dataStore, getPath(dataStore, path), data);
    return path;
});

export const update = curry((
    dataStore: DataStoreInstance, path: string, data: unknown, merger: (oldData: unknown, newData: unknown) => unknown = () => undefined): void => {
    set(dataStore, getPath(dataStore, path), mergeWith(
        get(dataStore, getPath(dataStore, path)) || {},
        data || {},
        merger,
    ));
});

export const load = async (dataStore: DataStoreInstance): Promise<DataStoreInstance> => {
    if (!dataStore.initialized) {
        logger.info(logger.create(dataStore), 'Loading...');
        return {
            ...dataStore,
            initialized: true,
            store: (await Apify.getValue(dataStore.kvKey) || {}) as Record<string, unknown>,
        };
    }
    return dataStore;
};

export const persist = async (dataStore: DataStoreInstance): Promise<void> => {
    await Apify.setValue(dataStore.kvKey, dataStore.store);
};

export default { create, get, set, has, increment, decrement, pop, shift, push, setAndGetKey, update, load, persist };
