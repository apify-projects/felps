"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneContext = exports.extend = exports.contextDefaulted = exports.create = void 0;
const tslib_1 = require("tslib");
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const utils = tslib_1.__importStar(require("@usefelps/helper--utils"));
const create = (requestOrRequestContext) => {
    const request = utils.clone(requestOrRequestContext?.request || requestOrRequestContext);
    const userData = {
        ...(request?.userData || {}),
        [CONST.METADATA_KEY]: utils.merge({
            flowStart: false,
            flowName: undefined,
            stepName: undefined,
            crawlerOptions: { mode: 'http' },
            reference: {},
        }, request?.userData?.[CONST.METADATA_KEY] || {}),
    };
    request.userData = userData;
    const data = request.userData[CONST.METADATA_KEY];
    return {
        ...core__instance_base_1.default.create({ key: 'request-meta', name: 'request-meta' }),
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
                [CONST.METADATA_KEY]: {
                    reference: {
                        [CONST.TRAIL_KEY_PROP]: utils.craftUIDKey('trail'),
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
            ...(requestMeta.userData || {}),
            [CONST.METADATA_KEY]: (metadata || []).reduce((acc, data) => utils.merge(acc, data), requestMeta.data),
        },
    });
};
exports.extend = extend;
const cloneContext = (context) => {
    return {
        ...context,
        request: utils.clone(context.request),
    };
};
exports.cloneContext = cloneContext;
exports.default = { create: exports.create, extend: exports.extend, contextDefaulted: exports.contextDefaulted, cloneContext: exports.cloneContext };
//# sourceMappingURL=index.js.map