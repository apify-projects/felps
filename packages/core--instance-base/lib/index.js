"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const helper__utils_1 = require("@usefelps/helper--utils");
const create = (options) => {
    const { key, name = 'default', uid = (0, helper__utils_1.craftUIDKey)(key), id = `${uid}-${name}`, } = options;
    return {
        key,
        name,
        uid,
        id,
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=index.js.map