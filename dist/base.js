"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const utils_1 = require("./utils");
const create = (options) => {
    const { key, name = 'default', uid = (0, utils_1.craftUIDKey)(key), id = `${uid}-${name}`, } = options;
    return {
        key,
        name,
        uid,
        id,
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=base.js.map