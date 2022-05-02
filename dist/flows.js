"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.names = exports.use = exports.create = void 0;
const tslib_1 = require("tslib");
const flow_1 = tslib_1.__importDefault(require("./flow"));
const create = ({ FLOWS }) => {
    return Object.keys(FLOWS).reduce((acc, name) => ({
        ...acc,
        [name]: flow_1.default.create({
            ...(FLOWS[name] || {}),
            name,
        }),
    }), {});
};
exports.create = create;
// eslint-disable-next-line max-len
const use = (_) => {
    return {
        define: (flows) => {
            return flows;
        },
    };
};
exports.use = use;
const names = (FLOWS) => {
    return Object.keys(FLOWS).reduce((acc, name) => ({
        ...acc,
        [name]: name,
    }), {});
};
exports.names = names;
exports.default = { create: exports.create, use: exports.use, names: exports.names };
//# sourceMappingURL=flows.js.map