"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const adapter__kv_store_1 = tslib_1.__importDefault(require("@usefelps/adapter--kv-store"));
exports.default = () => adapter__kv_store_1.default.create({
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
        if (prefix)
            keys = keys.filter((key) => key.startsWith(prefix));
        return { keys: keys.map((key) => ({ key })) };
    },
});
//# sourceMappingURL=index.js.map