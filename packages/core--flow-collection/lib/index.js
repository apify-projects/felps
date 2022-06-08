"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.names = exports.use = exports.create = void 0;
const tslib_1 = require("tslib");
const core__flow_1 = tslib_1.__importDefault(require("@usefelps/core--flow"));
const create = ({ FLOWS }) => {
    return Object.keys(FLOWS).reduce((acc, name) => ({
        ...acc,
        [name]: core__flow_1.default.create({
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
            // return flows as unknown as FlowDefinitions<keyof S, T>;
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
const clone = (flows) => {
    return Object.keys(flows)
        .reduce((acc, name) => ({
        ...acc,
        [name]: core__flow_1.default.create(flows[name]),
    }), {});
};
exports.clone = clone;
exports.default = { create: exports.create, use: exports.use, names: exports.names, clone: exports.clone };
//# sourceMappingURL=index.js.map