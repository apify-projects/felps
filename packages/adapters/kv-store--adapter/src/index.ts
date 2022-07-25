import InstanceBase from '@usefelps/instance-base';
import { KVStoreAdapterInstance, KVStoreAdapterListResult, KVStoreAdapterOptions, ReallyAny } from '@usefelps/types';

export const create = <T = ReallyAny>(options: KVStoreAdapterOptions): KVStoreAdapterInstance<T> => {
    return {
        ...InstanceBase.create({ name: options?.name || 'default', key: 'kv-store-adapter' }),
        resource: undefined,
        context: options?.context || {},
        init: options?.init,
        get: options.get,
        set: options.set,
        list: options.list,
    };
};

export const load = async (adapter: KVStoreAdapterInstance) => {
    return {
        ...adapter,
        resource: adapter?.resource || await Promise.resolve(adapter?.init?.(adapter)),
    };
};

export const get = async <T = ReallyAny>(adapter: KVStoreAdapterInstance<T>, key: string): Promise<T> => {
    const connected = await load(adapter);
    return connected.get(connected, key);
};

export const set = async <T = ReallyAny>(adapter: KVStoreAdapterInstance<T>, key: string, value: ReallyAny, options?: ReallyAny): Promise<string> => {
    const connected = await load(adapter);
    return connected.set(connected, key, value, options);
};

export const list = async <T = ReallyAny>(
    adapter: KVStoreAdapterInstance<T>, prefix?: string, options?: ReallyAny): Promise<KVStoreAdapterListResult> => {
    const connected = await load(adapter);
    return connected.list(connected, prefix, options);
};

export default { create, load, get, set, list };
