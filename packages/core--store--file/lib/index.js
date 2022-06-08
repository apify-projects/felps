"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
const apify_1 = tslib_1.__importDefault(require("apify"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const create = (options) => {
    const { name, kvKey, key = 'file-store' } = options || {};
    return {
        type: 'file-store',
        ...core__instance_base_1.default.create({ name, key }),
        kvKey: kvKey || name,
        resource: undefined,
        initialized: false,
        stats: { reads: 0, writes: 0 },
    };
};
exports.create = create;
const load = async (fileStore) => {
    if (fileStore.resource)
        return fileStore;
    return {
        ...fileStore,
        initialized: true,
        resource: await apify_1.default.openKeyValueStore(fileStore.kvKey),
    };
};
exports.load = load;
const get = async (fileStore, key) => {
    const loaded = await (0, exports.load)(fileStore);
    fileStore.stats.reads++;
    return loaded.resource?.getValue(key);
};
exports.get = get;
const set = async (fileStore, key, value, options) => {
    const loaded = await (0, exports.load)(fileStore);
    fileStore.stats.writes++;
    return loaded.resource?.setValue(key, value, options);
};
exports.set = set;
exports.default = { create: exports.create, load: exports.load, get: exports.get, set: exports.set };
//# sourceMappingURL=index.js.map