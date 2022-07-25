import { KeyValueStore } from '@crawlee/core';
import KvStoreAdapter from '@usefelps/kv-store--adapter';
import { KVStoreAdapterOptions } from '@usefelps/types';

export default (options?: KVStoreAdapterOptions) => KvStoreAdapter.create({
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
        const listed = await (connectedKv.resource as KeyValueStore as any).client.listKeys({ exclusiveStartKey: prefix, ...(options || {}) });

        return {
            keys: listed.items,
            cursor: listed.nextExclusiveStartKey,
        };
    },
    ...options,
});
