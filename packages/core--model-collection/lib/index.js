"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
const core__model_1 = tslib_1.__importDefault(require("@usefelps/core--model"));
const utils = tslib_1.__importStar(require("@usefelps/helper--utils"));
const create = ({ MODELS }) => {
    return Object.values(MODELS).reduce((namedModels, model) => {
        const m = core__model_1.default.create(model);
        return {
            ...namedModels,
            [m.name]: m,
        };
    }, {});
};
exports.create = create;
const define = (models) => {
    return Object.values(models).reduce((namedModels, model) => {
        const m = core__model_1.default.create(model);
        return {
            ...namedModels,
            [m.name]: m,
        };
    }, {});
};
exports.define = define;
const clone = (models) => {
    return utils.clone(models);
};
exports.clone = clone;
exports.default = { create: exports.create, define: exports.define, clone: exports.clone };
//# sourceMappingURL=index.js.map