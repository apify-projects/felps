import Apify from 'apify';
import cloneDeep from 'lodash.clonedeep';
import getByKey from 'lodash.get';
import hasByPath from 'lodash.has';
// import omit from 'lodash.omit';
import { dissocPath, mergeDeepRight } from 'ramda';
import setByKey from 'lodash.set';
import ApifyEvents from './apify-events';
import base from './base';
import { DataStoreInstance, DataStoreOptions, reallyAny } from './types';
import { craftUIDKey } from './utils';
import Logger from './logger';

const mustBeLoaded = (store: DataStoreInstance): void => {
    if (!store.initialized) {
        throw new Error('Store must be loaded before using it');
    }
};

export const create = (options: DataStoreOptions): DataStoreInstance => {
    const { name, kvKey, key = 'data-store', pathPrefix = '' } = options || {};

    return {
        type: 'data-store',
        ...base.create({ key, name, id: `${key}-${name}${kvKey ? `-${kvKey}` : ''}` }),
        kvKey: kvKey || name,
        pathPrefix,
        initialized: false,
        state: {},
    };
};

export const getPath = (dataStore: DataStoreInstance, path: string): string => {
    mustBeLoaded(dataStore);
    return [dataStore.pathPrefix, path].filter(Boolean).join('.');
};

export const get = <T = reallyAny>(dataStore: DataStoreInstance, path?: string): T => {
    mustBeLoaded(dataStore);
    return cloneDeep<reallyAny>(path ? getByKey(dataStore.state, getPath(dataStore, path)) : dataStore.state);
};

export const set = <T = reallyAny>(dataStore: DataStoreInstance, path: string, data: T): void => {
    mustBeLoaded(dataStore);
    const p = getPath(dataStore, path);
    setByKey(dataStore.state, p, data);
};

export const remove = (dataStore: DataStoreInstance, path: string): void => {
    mustBeLoaded(dataStore);
    dataStore.state = dissocPath(getPath(dataStore, path).split('.'), dataStore.state);
};

export const has = (dataStore: DataStoreInstance, path: string): boolean => {
    mustBeLoaded(dataStore);
    return hasByPath(dataStore.state, getPath(dataStore, path));
};

export const entries = <T = reallyAny>(dataStore: DataStoreInstance, path?: string): [string, T][] => {
    mustBeLoaded(dataStore);
    return Object.entries(get(dataStore, path) as Record<string, T>);
};

export const values = <T = reallyAny>(dataStore: DataStoreInstance, path?: string): T[] => {
    mustBeLoaded(dataStore);
    return Object.values(get(dataStore, path) as Record<string, T>);
};

export const keys = <T = reallyAny>(dataStore: DataStoreInstance, path?: string): string[] => {
    mustBeLoaded(dataStore);
    return Object.keys(get(dataStore, path) as Record<string, T>);
};

export const increment = (dataStore: DataStoreInstance, path: string, stepNumber = 1): number => {
    mustBeLoaded(dataStore);
    set(dataStore, getPath(dataStore, path), +(get(dataStore, getPath(dataStore, path)) || 0) + stepNumber);
    return +get(dataStore, getPath(dataStore, path));
};

export const decrement = (dataStore: DataStoreInstance, path: string, stepNumber = 1): number => {
    mustBeLoaded(dataStore);
    return increment(dataStore, path, -stepNumber);
};

export const pop = <T = reallyAny>(dataStore: DataStoreInstance, path: string): T => {
    mustBeLoaded(dataStore);
    const items = get(dataStore, getPath(dataStore, path)) as reallyAny[] || [];
    const item = items.pop();
    set(dataStore, getPath(dataStore, path), items);
    return item;
};

export const shift = <T = reallyAny>(dataStore: DataStoreInstance, path: string): T => {
    mustBeLoaded(dataStore);
    const items = get(dataStore, getPath(dataStore, path)) as reallyAny[] || [];
    const item = items.shift();
    set(dataStore, getPath(dataStore, path), items);
    return item;
};

export const push = <T = reallyAny>(dataStore: DataStoreInstance, path: string, ...data: T[]): void => {
    mustBeLoaded(dataStore);
    set(dataStore, getPath(dataStore, path), [...(get(dataStore, getPath(dataStore, path)) as reallyAny[] || []), ...data]);
};

export const setAndGetKey = <T = reallyAny>(dataStore: DataStoreInstance, data: T): string => {
    mustBeLoaded(dataStore);
    const path = craftUIDKey();
    set(dataStore, getPath(dataStore, path), data);
    return path;
};

export const update = <T = reallyAny>(dataStore: DataStoreInstance, path: string, data: T): void => {
    mustBeLoaded(dataStore);

    const p = getPath(dataStore, path);
    const original = get(dataStore, p) || {};
    const merged = mergeDeepRight<reallyAny, reallyAny>(original, data || {});

    set(dataStore, path, merged);
};

export const load = async (dataStore: DataStoreInstance): Promise<DataStoreInstance> => {
    if (!dataStore.initialized) {
        Logger.start(Logger.create(dataStore), 'Loading...');
        return {
            ...dataStore,
            initialized: true,
            state: (await Apify.getValue(dataStore.kvKey) || {}) as Record<string, unknown>,
        };
    }
    return dataStore;
};

export const persist = async (dataStore: DataStoreInstance): Promise<void> => {
    mustBeLoaded(dataStore);

    await Apify.setValue(dataStore.kvKey, dataStore.state);
};

export const listen = (dataStore: DataStoreInstance): void => {
    ApifyEvents.onShutdown(async () => {
        Logger.info(Logger.create(dataStore), 'Persisting store...');
        await persist(dataStore);
    });
};

export default { create, get, set, remove, has, entries, values, keys, increment, decrement, pop, shift, push, setAndGetKey, update, load, persist, listen };
