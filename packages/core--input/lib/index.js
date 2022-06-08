"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("@usefelps/helper--utils"));
const create = ({ INPUT }) => {
    return {
        ...INPUT,
        data: undefined,
    };
};
exports.create = create;
const define = (input) => {
    return input;
};
exports.define = define;
const clone = (input) => {
    return utils.clone(input);
};
exports.clone = clone;
exports.default = { create: exports.create, define: exports.define, clone: exports.clone };
//# sourceMappingURL=index.js.map