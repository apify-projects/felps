"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.define = exports.create = void 0;
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
exports.default = { create: exports.create, define: exports.define };
//# sourceMappingURL=models.js.map