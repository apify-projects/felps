"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.DefaultDatasets = void 0;
const tslib_1 = require("tslib");
const dataset_1 = tslib_1.__importDefault(require("./dataset"));
exports.DefaultDatasets = {
    default: dataset_1.default.create({}),
};
const create = (options) => {
    const { names = [] } = options || {};
    return names.reduce((datasets, name) => ({
        ...datasets,
        [name]: dataset_1.default.create({ name }),
    }), exports.DefaultDatasets);
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=datasets.js.map