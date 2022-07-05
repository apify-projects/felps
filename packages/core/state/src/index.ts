// import ApifyEvents from '@usefelps/apify-events';
import Base from '@usefelps/instance-base';
import KvStoreAdapter from '@usefelps/kv-store--adapter';
import InMemoryKvStoreAdapter from '@usefelps/kv-store--adapter--in-memory';
import Logger from '@usefelps/logger';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

const mustBeLoaded = <T>(state: FT.StateInstance<T>): void => {
    if (!state.initialized) {
        throw new Error('Store must be loaded before using it');
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
        ...Base.create({ key, name, id: `${key}-${name}${kvKey ? `-${kvKey}` : ''}` }),
        type: 'state',
        adapter,
        kvKey: kvKey || name,
        pathRoot,
        splitByKey,
        initialized: false,
        storage: {},
        stats: { reads: 0, writes: 0 },
    };
};

export const getPath = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P ): string => {
    mustBeLoaded(state);
    return [state.pathRoot, path].filter(Boolean).join('.');
};

export const get = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path?: P): FT.PathValue<T, P> => {
    mustBeLoaded(state);
    return utils.clone<FT.ReallyAny>(path ? utils.get(state.storage, getPath(state, path)) : state.storage);
};

export const reduce = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P, valueOrReducer: FT.PathValue<T, P> | ((previous: FT.PathValue<T, P>) => FT.PathValue<T, P>)): FT.ReallyAny => {
    mustBeLoaded(state);
    const absolutePath = getPath(state, path);
    const previous = utils.get(state.storage, absolutePath);
    utils.set(state.storage, absolutePath, typeof valueOrReducer === 'function' ? (valueOrReducer as Function)(previous) : valueOrReducer);
    return absolutePath;
}

export const set = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P | string, dataOrReducer: (FT.PathValue<T, P> & FT.ReallyAny) | ((previous: FT.PathValue<T, P> & FT.ReallyAny) => FT.PathValue<T, P> & FT.ReallyAny)): FT.DataPath => {
    mustBeLoaded(state);
    const absolutePath = getPath<T, P>(state, path as unknown as P);
    return reduce(state, absolutePath as FT.ReallyAny, dataOrReducer);
};

export const remove = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P): void => {
    mustBeLoaded(state);
    const absolutePath = getPath(state, path);
    utils.unset(state.storage, absolutePath.split('.'));
};

export const has = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P): boolean => {
    mustBeLoaded(state);
    return utils.has(state.storage, getPath(state, path));
};

export const entries = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path?: P): [string, T][] => {
    mustBeLoaded(state);
    return Object.entries(get(state, path) as Record<string, T>);
};

export const values = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path?: P): T[] => {
    mustBeLoaded(state);
    return Object.values(get(state, path) as Record<string, T>);
};

export const keys = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path?: P): string[] => {
    mustBeLoaded(state);
    return Object.keys(get(state, path) as Record<string, T>);
};

export const increment = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P, stepNumber = 1): number => {
    mustBeLoaded(state);
    const nextIncrement: number = +(get(state, getPath(state, path as FT.ReallyAny) as FT.ReallyAny) || 0) + stepNumber;
    set(state, getPath(state, path) as FT.ReallyAny, nextIncrement as FT.ReallyAny);
    return +get(state, getPath(state, path) as FT.ReallyAny);
};

export const decrement = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P, stepNumber = 1): number => {
    mustBeLoaded(state);
    return increment(state, path, -stepNumber);
};

export const pop = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P): T => {
    mustBeLoaded(state);
    const items = get(state, getPath(state, path as FT.ReallyAny) as FT.ReallyAny) as FT.ReallyAny[] || [];
    const item = items.pop();
    set(state, getPath(state, path as FT.ReallyAny) as FT.ReallyAny, items as FT.ReallyAny);
    return item;
};

export const shift = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P): T => {
    mustBeLoaded(state);
    const items = get(state, getPath(state, path) as FT.ReallyAny) as FT.ReallyAny[] || [];
    const item = items.shift();
    set(state, getPath(state, path) as FT.ReallyAny, items as FT.ReallyAny);
    return item;
};

export const push = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P, ...data: T[]): FT.DataPath => {
    mustBeLoaded(state);
    return set(state, getPath(state, path) as FT.ReallyAny, [...(get(state, getPath(state, path) as FT.ReallyAny) as FT.ReallyAny[] || []), ...data] as FT.ReallyAny);
};

export const unshift = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P, ...data: T[]): FT.DataPath => {
    mustBeLoaded(state);
    return set(state, getPath(state, path) as FT.ReallyAny, [...data, ...(get(state, getPath(state, path) as FT.ReallyAny) as FT.ReallyAny[] || [])] as FT.ReallyAny);
};

export const setAndGetKey = <T, D>(state: FT.StateInstance<T>, data: D): FT.DataPath => {
    mustBeLoaded(state);
    const path = utils.craftUIDKey() as FT.ReallyAny;
    const absolutePath = getPath(state, path) as FT.ReallyAny;
    return set(state, absolutePath, data as FT.ReallyAny);
};

export const update = <T, P extends FT.Path<T>>(state: FT.StateInstance<T>, path: P, data: T): FT.DataPath => {
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
                storage[key] = await KvStoreAdapter.get(connected, key) || {};
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

    Logger.info(Logger.create(state), 'Persisting store...', { stats: state.stats });
};

// export const listen = (state: FT.StateInstance<T>): void => {
//     ApifyEvents.onAll(async () => {
//         await persist(state);
//     });
// };

export default { create, get, set, remove, has, entries, values, keys, increment, decrement, pop, shift, push, unshift, setAndGetKey, update, load, persist, reduce };
