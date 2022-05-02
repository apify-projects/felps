"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withinObjects = exports.withinTexts = exports.withinTextsAsIndexes = exports.create = void 0;
const tslib_1 = require("tslib");
const flexsearch_1 = require("flexsearch");
const lodash_get_1 = tslib_1.__importDefault(require("lodash.get"));
const _1 = require(".");
const create = (options) => {
    const { name, indexOptions, documentOptions } = options || {};
    return {
        ..._1.Base.create({ key: 'search', name: name || 'default' }),
        indexOptions,
        documentOptions,
    };
};
exports.create = create;
const withinTextsAsIndexes = (search, items, query) => {
    const index = new flexsearch_1.Index(search.indexOptions);
    for (const [idx, item] of Object.entries(items)) {
        index.add(idx, item);
    }
    ;
    return index.search(query);
};
exports.withinTextsAsIndexes = withinTextsAsIndexes;
const withinTexts = (search, items, query) => {
    return (0, exports.withinTextsAsIndexes)(search, items, query).map((idx) => items[+idx]);
};
exports.withinTexts = withinTexts;
const withinObjects = (search, path, items, query) => {
    const indexes = (0, exports.withinTextsAsIndexes)(search, items.map((item) => (0, lodash_get_1.default)(item, path)), query);
    return indexes.map((idx) => items[+idx]);
};
exports.withinObjects = withinObjects;
// export const withinObjects = <T extends Record<string, ReallyAny>>(search: SearchInstance, items: T[], query: string): T[] => {
//     const index = new Document(search.documentOptions);
//     for (const [idx, item] of Object.entries(items)) {
//         index.add(idx, item);
//     };
//     const sortedByFields = index.search(query);
//     // TODO: To improve!
//     const indexes = sortedByFields.map((item) => item.result).flat();
//     return indexes.map((idx) => items[+idx]);
// };
exports.default = { create: exports.create, withinObjects: exports.withinObjects, withinTexts: exports.withinTexts, withinTextsAsIndexes: exports.withinTextsAsIndexes };
//# sourceMappingURL=search.js.map