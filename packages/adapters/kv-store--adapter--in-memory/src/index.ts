import KvStoreAdapter from '@usefelps/kv-store--adapter';

export default () => KvStoreAdapter.create({
    async init() {
        return {};
    },
    async get(connectedKv, key) {
        return connectedKv.resource[key];
    },
    async set(connectedKv, key, value) {
        connectedKv.resource[key] = value;
    },
    async list(connectedKv, prefix) {
        let keys = Object.keys(connectedKv.resource);
        if (prefix) keys = keys.filter((key) => key.startsWith(prefix));

        return { keys: keys.map((key) => ({ key })) };
    },
});
