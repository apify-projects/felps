import { KeyValueStore } from '@crawlee/core';
import KvStoreAdapter from '@usefelps/kv-store--adapter';
import { KVStoreAdapterListResult, KVStoreAdapterOptions } from '@usefelps/types';

export default (options?: Partial<KVStoreAdapterOptions>) => KvStoreAdapter.create({
    async init(adapter) {
        const { name } = adapter?.context || {};
        return KeyValueStore.open(name === 'default' ? undefined : name);
    },
    async get(connectedKv, key) {
        return (connectedKv.resource as KeyValueStore).getValue(key);
    },
    async set(connectedKv, key, value) {
        return (connectedKv.resource as KeyValueStore).setValue(key, value);
    },
    async list(connectedKv, prefix, options) {
        const keys: KVStoreAdapterListResult['keys'] = [];
        await (connectedKv.resource as KeyValueStore)
            .forEachKey(
                (key, _, info) => {
                    if (key.startsWith(prefix)) {
                        keys.push({ key, size: info.size })
                    }
                },
                { ...(options || {}) },
            );
        return { keys };
    },
    ...options,
});
