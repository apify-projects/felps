"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apify_1 = tslib_1.__importDefault(require("apify"));
const adapter__kv_store_1 = tslib_1.__importDefault(require("@usefelps/adapter--kv-store"));
exports.default = () => adapter__kv_store_1.default.create({
    async init(adapter) {
        return apify_1.default.openKeyValueStore(adapter?.name === 'default' ? undefined : adapter?.name);
    },
    async get(connectedKv, key) {
        return connectedKv.resource.getValue(key);
    },
    async set(connectedKv, key, value) {
        return connectedKv.resource.setValue(key, value);
    },
    async list(connectedKv, prefix, options) {
        const listed = await connectedKv.resource.client.listKeys({ exclusiveStartKey: prefix, ...(options || {}) });
        return {
            keys: listed.items,
            cursor: listed.nextExclusiveStartKey,
        };
    },
});
//# sourceMappingURL=index.js.map