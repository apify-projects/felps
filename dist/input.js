"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.define = exports.create = void 0;
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
exports.default = { create: exports.create, define: exports.define };
//# sourceMappingURL=input.js.map