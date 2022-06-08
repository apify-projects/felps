"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAny = exports.find = exports.stringify = exports.parse = exports.create = void 0;
const tslib_1 = require("tslib");
const node_url_1 = require("node:url");
const route_parser_1 = tslib_1.__importDefault(require("route-parser"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const create = (options) => {
    const { name, pattern } = options;
    return {
        ...core__instance_base_1.default.create({ key: 'search', name: name || 'default' }),
        pattern,
        resource: new route_parser_1.default(pattern),
    };
};
exports.create = create;
const parse = (urlPattern, url) => {
    try {
        const link = new node_url_1.URL(url);
        const matched = urlPattern.resource.match(link.pathname);
        if (!matched)
            return undefined;
        return {
            origin: link.origin,
            pathParams: matched || {},
            searchParams: Object.fromEntries(link.searchParams.entries()),
        };
    }
    catch (error) {
        return undefined;
    }
};
exports.parse = parse;
const stringify = (urlPattern, data) => {
    return urlPattern.resource.reverse(data);
};
exports.stringify = stringify;
const find = (urlPatterns, url) => {
    for (const urlPattern of urlPatterns) {
        const parsed = (0, exports.parse)(urlPattern, url);
        if (parsed) {
            return urlPattern;
        }
    }
};
exports.find = find;
const parseAny = (urlPatterns, url) => {
    for (const urlPattern of urlPatterns) {
        const parsed = (0, exports.parse)(urlPattern, url);
        if (parsed) {
            return parsed;
        }
    }
    return undefined;
};
exports.parseAny = parseAny;
exports.default = { create: exports.create, parse: exports.parse, parseAny: exports.parseAny, stringify: exports.stringify, find: exports.find };
//# sourceMappingURL=index.js.map