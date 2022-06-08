"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const apify_client_1 = require("apify-client");
const create = (options) => {
    const { token = process.env.APIFY_TOKEN, ...restOptions } = options || {};
    return {
        resource: new apify_client_1.ApifyClient({ token, ...restOptions }),
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=index.js.map