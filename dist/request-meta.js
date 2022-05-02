"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = exports.contextDefaulted = exports.create = void 0;
const tslib_1 = require("tslib");
const lodash_clonedeep_1 = tslib_1.__importDefault(require("lodash.clonedeep"));
const ramda_1 = require("ramda");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const utils_1 = require("./utils");
const create = (requestOrRequestContext) => {
    const request = (0, lodash_clonedeep_1.default)(requestOrRequestContext?.request || requestOrRequestContext);
    const userData = {
        ...(request?.userData || {}),
        [consts_1.METADATA_KEY]: (0, ramda_1.mergeDeepRight)({
            flowName: undefined,
            stepName: undefined,
            crawlerMode: undefined,
            reference: {},
        }, request?.userData?.[consts_1.METADATA_KEY] || {}),
    };
    request.userData = userData;
    const data = request.userData[consts_1.METADATA_KEY];
    return {
        ...base_1.default.create({ key: 'request-meta', name: 'request-meta' }),
        request,
        userData,
        data,
    };
};
exports.create = create;
const contextDefaulted = (context) => {
    return (context || {
        request: {
            userData: {
                [consts_1.METADATA_KEY]: {
                    reference: {
                        [consts_1.TRAIL_KEY_PROP]: (0, utils_1.craftUIDKey)('trail'),
                    },
                },
            },
        },
    });
};
exports.contextDefaulted = contextDefaulted;
const extend = (requestMeta, ...metadata) => {
    return (0, exports.create)({
        ...requestMeta.request,
        userData: {
            ...requestMeta.userData,
            [consts_1.METADATA_KEY]: metadata.reduce((acc, data) => (0, ramda_1.mergeDeepRight)(acc, data), requestMeta.data),
        },
    });
};
exports.extend = extend;
exports.default = { create: exports.create, extend: exports.extend, contextDefaulted: exports.contextDefaulted };
//# sourceMappingURL=request-meta.js.map