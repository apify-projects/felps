"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.define = exports.create = void 0;
const tslib_1 = require("tslib");
const lodash_clonedeep_1 = tslib_1.__importDefault(require("lodash.clonedeep"));
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
    return (0, lodash_clonedeep_1.default)(input);
};
exports.clone = clone;
exports.default = { create: exports.create, define: exports.define, clone: exports.clone };
//# sourceMappingURL=input.js.map