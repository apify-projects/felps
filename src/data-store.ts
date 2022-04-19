import Apify from 'apify';
import cloneDeep from 'lodash.clonedeep';
import getByKey from 'lodash.get';
import hasByPath from 'lodash.has';
import mergeWith from 'lodash.mergewith';
import setByKey from 'lodash.set';
import base from './base';
import { DataStoreInstance, DataStoreOptions, reallyAny } from './common/types';
import { craftUIDKey } from './common/utils';
import logger from './logger';

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

export const getPath = (dataStore: DataStoreInstance, path: string): string => {
    return [dataStore.pathPrefix, path].filter(Boolean).join('.');
};

export const get = <T = reallyAny>(dataStore: DataStoreInstance, path: string): T => {
    return cloneDeep(path ? getByKey(dataStore.store, getPath(dataStore, path)) : dataStore.store);
};

export const set = <T = reallyAny>(dataStore: DataStoreInstance, path: string, data: T): void => {
    setByKey(dataStore.store, getPath(dataStore, path), data);
};

export const has = (dataStore: DataStoreInstance, path: string): boolean => {
    return hasByPath(dataStore.store, getPath(dataStore, path));
};

export const increment = (dataStore: DataStoreInstance, path: string, stepNumber = 1): number => {
    set(dataStore, getPath(dataStore, path), +(get(dataStore, getPath(dataStore, path)) || 0) + stepNumber);
    return +get(dataStore, getPath(dataStore, path));
};

export const decrement = (dataStore: DataStoreInstance, path: string, stepNumber = 1): number => {
    return increment(dataStore, path, -stepNumber);
};

export const pop = <T = reallyAny>(dataStore: DataStoreInstance, path: string): T => {
    const items = get(dataStore, getPath(dataStore, path)) as reallyAny[] || [];
    const item = items.pop();
    set(dataStore, getPath(dataStore, path), items);
    return item;
};

export const shift = <T = reallyAny>(dataStore: DataStoreInstance, path: string): T => {
    const items = get(dataStore, getPath(dataStore, path)) as reallyAny[] || [];
    const item = items.shift();
    set(dataStore, getPath(dataStore, path), items);
    return item;
};

export const push = <T = reallyAny>(dataStore: DataStoreInstance, path: string, data: T): void => {
    set(dataStore, getPath(dataStore, path), [...(get(dataStore, getPath(dataStore, path)) as reallyAny[] || []), data]);
};

export const setAndGetKey = <T = reallyAny>(dataStore: DataStoreInstance, data: T): string => {
    const path = craftUIDKey();
    set(dataStore, getPath(dataStore, path), data);
    return path;
};

export const update = <T = reallyAny>(
    dataStore: DataStoreInstance, path: string, data: T, merger: (oldData: T, newData: T) => unknown = () => undefined): void => {
    set(dataStore, getPath(dataStore, path), mergeWith(
        get(dataStore, getPath(dataStore, path)) || {},
        data || {},
        merger,
    ));
};

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
