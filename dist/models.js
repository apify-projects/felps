"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
const lodash_clonedeep_1 = tslib_1.__importDefault(require("lodash.clonedeep"));
const _1 = require(".");
const create = ({ MODELS }) => {
    return Object.values(MODELS).reduce((namedModels, model) => {
        const m = _1.Model.create(model);
        return {
            ...namedModels,
            [m.name]: m,
        };
    }, {});
};
exports.create = create;
const define = (models) => {
    return Object.values(models).reduce((namedModels, model) => {
        const m = _1.Model.create(model);
        return {
            ...namedModels,
            [m.name]: m,
        };
    }, {});
};
exports.define = define;
const clone = (models) => {
    return (0, lodash_clonedeep_1.default)(models);
};
exports.clone = clone;
exports.default = { create: exports.create, define: exports.define, clone: exports.clone };
//# sourceMappingURL=models.js.map