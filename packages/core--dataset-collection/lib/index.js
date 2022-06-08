"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.create = exports.DefaultDatasetCollection = void 0;
const tslib_1 = require("tslib");
const core__dataset_1 = tslib_1.__importDefault(require("@usefelps/core--dataset"));
exports.DefaultDatasetCollection = {
    default: core__dataset_1.default.create({}),
};
const create = (options) => {
    const { names = [] } = options || {};
    return names.reduce((datasets, name) => ({
        ...datasets,
        [name]: core__dataset_1.default.create({ name }),
    }), exports.DefaultDatasetCollection);
};
exports.create = create;
const close = async (datasets) => {
    await Promise.all(Object.values(datasets).map((d) => core__dataset_1.default.close(d)));
};
exports.close = close;
exports.default = { create: exports.create, close: exports.close };
//# sourceMappingURL=index.js.map