"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.push = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const apify_1 = tslib_1.__importDefault(require("apify"));
const base_1 = tslib_1.__importDefault(require("./base"));
const create = (options) => {
    const { name } = options || {};
    return {
        ...base_1.default.create({ key: 'dataset', name: name }),
        resource: undefined,
    };
};
exports.create = create;
const load = async (dataset) => {
    if (dataset.resource)
        return dataset;
    return {
        ...dataset,
        resource: await apify_1.default.openDataset(dataset.name),
    };
};
exports.load = load;
const push = async (dataset, data) => {
    const loaded = await (0, exports.load)(dataset);
    return loaded.resource?.pushData(data);
};
exports.push = push;
exports.default = { create: exports.create, load: exports.load, push: exports.push };
//# sourceMappingURL=dataset.js.map