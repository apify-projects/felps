"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const helper__utils_1 = require("@usefelps/helper--utils");
const create = () => {
    return {
        ...core__instance_base_1.default.create({ key: 'step-api-helpers', name: 'step-api-helpers' }),
        handler(context) {
            return {
                absoluteUrl: (path) => (0, helper__utils_1.resolveUrl)(path, context?.request?.loadedUrl && context?.request?.loadedUrl !== 'about:blank'
                    ? context.request?.loadedUrl
                    : context.request?.url),
            };
        },
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=index.js.map