"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = exports.defaultUpdateMerger = void 0;
const utils_1 = require("./utils");
const defaultUpdateMerger = (existingValue, newValue) => {
    if (!newValue && typeof existingValue !== 'number')
        return existingValue;
    if (Array.isArray(newValue)) {
        return (0, utils_1.concatAsUniqueArray)(existingValue, newValue);
    }
    return undefined;
};
exports.defaultUpdateMerger = defaultUpdateMerger;
const getPath = (trailData, ref, ...segments) => {
    const referenceKey = trailData?.referenceKey;
    const key = ref?.[referenceKey];
    if (!key) {
        throw new Error(`No reference key ${referenceKey} found for ${JSON.stringify(ref)}`);
    }
    return (0, utils_1.pathify)(trailData.path, key, ...segments);
};
exports.getPath = getPath;
exports.default = { getPath: exports.getPath, defaultUpdateMerger: exports.defaultUpdateMerger };
//# sourceMappingURL=trail-data.js.map