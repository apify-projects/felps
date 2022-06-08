"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = void 0;
const extend = (...instances) => {
    return {
        with: (options) => {
            return instances.map((i) => Object.assign(i, options));
        },
    };
};
exports.extend = extend;
exports.default = { extend: exports.extend };
//# sourceMappingURL=index.js.map