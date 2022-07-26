import InstanceBase from '@usefelps/instance-base';
import KvStoreAdapter from '@usefelps/kv-store--adapter';
import InMemoryKvStoreAdapter from '@usefelps/kv-store--adapter--in-memory';
import Logger from '@usefelps/logger';
import Process from '@usefelps/process';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

const mustBeLoaded = <T>(state: FT.StateInstance<T>): void => {
    if (!state.initialized) {
        throw new Error(`Store must be loaded before using it (${state.name})`);
    }
};

export const create = <T>(options: FT.StateOptions): FT.StateInstance<T> => {
    const {
        adapter = InMemoryKvStoreAdapter(),
        name,
        kvKey,
        key = 'state',
        splitByKey = false,
        pathRoot = ''
    } = options || {};

    return {
        ...InstanceBase.create({ key, name, id: `${key}-${name}${kvKey ? `-${kvKey}` : ''}` }),
        type: 'state',
        adapter,
        kvKey: kvKey || name,
        pathRoot,
        splitByKey,
        initialized: false,
        listened: false,
        storage: {},
        stats: { reads: 0, writes: 0 },
    };
};

export const getPath = (state: FT.StateInstance, path: string): string => {
    mustBeLoaded(state);
    return [state.pathRoot, path].filter(Boolean).join('.');
};

export const get = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path?: string): T => {
    mustBeLoaded(state);
    const data = path ? utils.get(state.storage, getPath(state, path)) : state.storage;
    return utils.clone<FT.ReallyAny>(data);
};

export const reduce = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string, valueOrReducer: FT.ReallyAny | ((previous: FT.ReallyAny) => FT.ReallyAny)): FT.ReallyAny => {
    mustBeLoaded(state);
    const absolutePath = getPath(state, path);
    const previous = utils.get(state.storage, absolutePath);
    utils.set(state.storage, absolutePath, typeof valueOrReducer === 'function' ? (valueOrReducer as Function)(previous) : valueOrReducer);
    return absolutePath;
}

export const set = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string, dataOrReducer: (FT.ReallyAny & FT.ReallyAny) | ((previous: FT.ReallyAny & FT.ReallyAny) => FT.ReallyAny & FT.ReallyAny)): FT.DataPath => {
    mustBeLoaded(state);
    const absolutePath = getPath(state, path);
    return reduce(state, absolutePath as FT.ReallyAny, dataOrReducer);
};

export const replace = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string, data: (FT.ReallyAny)): void => {
    mustBeLoaded(state);
    const absolutePath = getPath(state, path);
    utils.set(state.storage, absolutePath, data);
};

export const remove = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string): void => {
    mustBeLoaded(state);
    const absolutePath = getPath(state, path);
    utils.unset(state.storage, absolutePath.split('.'));
};

export const has = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string): boolean => {
    mustBeLoaded(state);
    return utils.has(state.storage, getPath(state, path));
};

export const entries = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path?: string): [string, T][] => {
    mustBeLoaded(state);
    return Object.entries(get(state, path) as Record<string, T>);
};

export const values = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path?: string): T[] => {
    mustBeLoaded(state);
    return Object.values(get(state, path) as Record<string, T>);
};

export const keys = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path?: string): string[] => {
    mustBeLoaded(state);
    return Object.keys(get(state, path) as Record<string, T>);
};

export const increment = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string, stepNumber = 1): number => {
    mustBeLoaded(state);
    const nextIncrement: number = +(get(state, getPath(state, path as FT.ReallyAny) as FT.ReallyAny) || 0) + stepNumber;
    set(state, getPath(state, path) as FT.ReallyAny, nextIncrement as FT.ReallyAny);
    return +get(state, getPath(state, path) as FT.ReallyAny);
};

export const decrement = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string, stepNumber = 1): number => {
    mustBeLoaded(state);
    return increment(state, path, -stepNumber);
};

export const pop = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string): T => {
    mustBeLoaded(state);
    const items = get(state, getPath(state, path as FT.ReallyAny) as FT.ReallyAny) as FT.ReallyAny[] || [];
    const item = items.pop();
    set(state, getPath(state, path as FT.ReallyAny) as FT.ReallyAny, items as FT.ReallyAny);
    return item;
};

export const shift = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string): T => {
    mustBeLoaded(state);
    const items = get(state, getPath(state, path) as FT.ReallyAny) as FT.ReallyAny[] || [];
    const item = items.shift();
    set(state, getPath(state, path) as FT.ReallyAny, items as FT.ReallyAny);
    return item;
};

export const push = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string, ...data: T[]): FT.DataPath => {
    mustBeLoaded(state);
    return set(state, getPath(state, path) as FT.ReallyAny, [...(get(state, getPath(state, path) as FT.ReallyAny) as FT.ReallyAny[] || []), ...data] as FT.ReallyAny);
};

export const unshift = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string, ...data: T[]): FT.DataPath => {
    mustBeLoaded(state);
    return set(state, getPath(state, path) as FT.ReallyAny, [...data, ...(get(state, getPath(state, path) as FT.ReallyAny) as FT.ReallyAny[] || [])] as FT.ReallyAny);
};

export const setAndGetKey = <T, D>(state: FT.StateInstance<T>, data: D): FT.DataPath => {
    mustBeLoaded(state);
    const path = utils.craftUIDKey() as FT.ReallyAny;
    const absolutePath = getPath(state, path) as FT.ReallyAny;
    return set(state, absolutePath, data as FT.ReallyAny);
};

export const update = <T extends FT.ReallyAny = FT.ReallyAny>(state: FT.StateInstance<T>, path: string, data: T): FT.DataPath => {
    mustBeLoaded(state);

    const absolutePath = getPath(state, path);
    const original = get(state, absolutePath as FT.ReallyAny) || {};
    const merged = utils.merge(original, data || {});

    return set(state, absolutePath as FT.ReallyAny, merged);
};

export const load = async <T>(state: FT.StateInstance<T>): Promise<FT.StateInstance<T>> => {
    if (!state.initialized) {
        let storage: Record<string, FT.ReallyAny> = {};
        const connected = await KvStoreAdapter.load(state.adapter);

        if (state.splitByKey) {
            const currentKeys = await KvStoreAdapter.list(connected, state.kvKey);
            for (const { key } of currentKeys.keys) {
                state.stats.reads++;
                const [, keyId] = key.split('-');
                storage[keyId] = await KvStoreAdapter.get(connected, key) || {};
            }
        } else {
            state.stats.reads++;
            storage = await KvStoreAdapter.get(connected, state.kvKey) || {};
        }

        return {
            ...state,
            initialized: true,
            storage,
        };
    }
    return state;
};

export const persist = async <T>(state: FT.StateInstance<T>): Promise<void> => {
    mustBeLoaded(state);

    if (state.splitByKey) {
        await Promise.allSettled(entries(state).map(([key, value]) => {
            state.stats.writes++;
            return KvStoreAdapter.set(state.adapter, `${state.kvKey}-${key}`, value);
        }));
    } else {
        await KvStoreAdapter.set(state.adapter, state.kvKey, state.storage);
    };

    Logger.info(Logger.create(state), `Persisted store ${state.kvKey}.`);
};

export const listen = <T>(state: FT.StateInstance<T>): FT.StateInstance<T> => {
    if (!state.listened) {
        state.listened = true;
        let firstInterval: NodeJS.Timer;
        firstInterval = Process.onInterval(async () => {
            await persist(state);
            clearInterval(firstInterval);
        }, 1000);

        Process.onInterval(async () => {
            await persist(state);
        })

        Process.onExit(async () => {
            await persist(state);
        })
    }

    return state;
};

export default { create, get, set, remove, has, entries, values, keys, increment, decrement, pop, shift, push, unshift, setAndGetKey, update, load, persist, reduce, listen, replace };
