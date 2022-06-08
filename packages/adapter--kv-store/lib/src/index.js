"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.set = exports.get = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const create = (options) => {
    return {
        ...core__instance_base_1.default.create({ name: 'kv-store-adapter' }),
        resource: undefined,
        init: options?.init,
        get: options.get,
        set: options.set,
        list: options.list,
    };
};
exports.create = create;
const load = async (adapter) => {
    return {
        ...adapter,
        resource: adapter?.resource || await Promise.resolve(adapter?.init?.()),
    };
};
exports.load = load;
const get = async (adapter, key) => {
    const connected = await (0, exports.load)(adapter);
    return connected.get(connected, key);
};
exports.get = get;
const set = async (adapter, key, value, options) => {
    const connected = await (0, exports.load)(adapter);
    return connected.set(connected, key, value, options);
};
exports.set = set;
const list = async (adapter, prefix, options) => {
    const connected = await (0, exports.load)(adapter);
    return connected.list(connected, prefix, options);
};
exports.list = list;
exports.default = { create: exports.create, load: exports.load, get: exports.get, set: exports.set, list: exports.list };
//# sourceMappingURL=index.js.map