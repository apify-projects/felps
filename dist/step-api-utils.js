"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const base_1 = tslib_1.__importDefault(require("./base"));
const utils_1 = require("./utils");
const create = () => {
    return {
        ...base_1.default.create({ key: 'step-api-utils', name: 'step-api-utils' }),
        handler(context) {
            return {
                absoluteUrl: (path) => (0, utils_1.resolveUrl)(path, context?.request?.loadedUrl && context?.request?.loadedUrl !== 'about:blank'
                    ? context.request?.loadedUrl
                    : context.request?.url),
            };
        },
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=step-api-utils.js.map