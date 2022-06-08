"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.push = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const apify_1 = tslib_1.__importDefault(require("apify"));
const core__events_1 = tslib_1.__importDefault(require("@usefelps/core--events"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const create = (options) => {
    const { name } = options || {};
    return {
        ...core__instance_base_1.default.create({ key: 'dataset', name: name }),
        resource: undefined,
        events: core__events_1.default.create({ name: name }),
    };
};
exports.create = create;
const load = async (dataset) => {
    if (dataset.resource)
        return dataset;
    return {
        ...dataset,
        resource: await apify_1.default.openDataset(dataset.name !== 'default' ? dataset.name : undefined),
    };
};
exports.load = load;
const push = async (dataset, data) => {
    const loaded = await (0, exports.load)(dataset);
    if (loaded.resource) {
        core__events_1.default.emit(dataset.events, 'push', data);
        return loaded.resource.pushData(data);
    }
};
exports.push = push;
const close = async (dataset) => {
    await core__events_1.default.close(dataset.events);
};
exports.close = close;
exports.default = { create: exports.create, load: exports.load, push: exports.push, close: exports.close };
//# sourceMappingURL=index.js.map