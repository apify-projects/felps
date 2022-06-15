import { KeyValueStore } from '@crawlee/core';
import KvStoreAdapter from '@usefelps/kv-store--adapter';

export default () => KvStoreAdapter.create({
    async init(adapter) {
        return KeyValueStore.open(adapter?.name === 'default' ? undefined : adapter?.name);
    },
    async get(connectedKv, key) {
        return (connectedKv.resource as KeyValueStore).getValue(key);
    },
    async set(connectedKv, key, value) {
        return (connectedKv.resource as KeyValueStore).setValue(key, value);
    },
    async list() {
        // async list(connectedKv, prefix, options) {
        // const listed = await (connectedKv.resource as KeyValueStore).client.listKeys({ exclusiveStartKey: prefix, ...(options || {}) });

        return {
            keys: []
            // keys: listed.items,
            // cursor: listed.nextExclusiveStartKey,
        };
    },
});
