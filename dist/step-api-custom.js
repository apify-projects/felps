"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const base_1 = tslib_1.__importDefault(require("./base"));
// eslint-disable-next-line max-len
const create = () => {
    // const { } = options || {};
    return {
        ...base_1.default.create({ key: 'step-api-custom', name: 'step-api-custom' }),
        // handler(RequestContext) {
        // }
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=step-api-custom.js.map