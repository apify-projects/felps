"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStatus = exports.set = exports.getReference = exports.count = exports.filterByFlowStart = exports.getItemsListByStatus = exports.getItemsList = exports.getItems = exports.get = exports.has = exports.create = void 0;
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const lodash_ismatch_1 = tslib_1.__importDefault(require("lodash.ismatch"));
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const data_store_1 = tslib_1.__importDefault(require("./data-store"));
const request_meta_1 = tslib_1.__importDefault(require("./request-meta"));
const trail_data_1 = require("./trail-data");
const utils_1 = require("./utils");
const create = (options) => {
    const { id, type, store } = options;
    const key = `store-trail-data-requests`;
    const name = `trail-data-model-requests`;
    const path = (0, utils_1.pathify)(id, type, 'requests');
    return {
        ...base_1.default.create({ key, name, id }),
        referenceKey: consts_1.REQUEST_KEY_PROP,
        path,
        store,
    };
};
exports.create = create;
const has = (trailDataRequests, ref) => {
    return data_store_1.default.has(trailDataRequests.store, (0, trail_data_1.getPath)(trailDataRequests, ref));
};
exports.has = has;
const get = (trailDataRequests, ref) => {
    return data_store_1.default.get(trailDataRequests.store, (0, trail_data_1.getPath)(trailDataRequests, ref));
};
exports.get = get;
const getItems = (trailDataRequests) => {
    return data_store_1.default.get(trailDataRequests.store, trailDataRequests.path);
};
exports.getItems = getItems;
const getItemsList = (trailDataRequests, ref) => {
    const items = Object.values((0, exports.getItems)(trailDataRequests) || {});
    return ref ? items.filter((item) => (0, lodash_ismatch_1.default)(request_meta_1.default.create(item.source).data?.reference, ref)) : items;
};
exports.getItemsList = getItemsList;
const getItemsListByStatus = (trailDataRequests, status, ref) => {
    const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean);
    return (0, exports.getItemsList)(trailDataRequests, ref).filter((item) => statuses.includes(item.status));
};
exports.getItemsListByStatus = getItemsListByStatus;
const filterByFlowStart = (item) => {
    const meta = _1.RequestMeta.create(item.source);
    return meta.data.flowStart;
};
exports.filterByFlowStart = filterByFlowStart;
const count = (trailDataRequests, ref) => {
    return (0, exports.getItemsList)(trailDataRequests, ref).length;
};
exports.count = count;
const getReference = (trailDataRequests, ref) => {
    const meta = request_meta_1.default.create((0, exports.get)(trailDataRequests, ref).source);
    return (meta?.data?.reference || {});
};
exports.getReference = getReference;
const set = (trailDataRequests, request, ref) => {
    const meta = _1.RequestMeta.extend(_1.RequestMeta.create(request), { reference: { [consts_1.REQUEST_KEY_PROP]: (0, utils_1.craftUIDKey)(consts_1.REQUEST_UID_KEY), ...ref } });
    if (meta.data.reference) {
        const item = {
            id: meta.data.reference?.[consts_1.REQUEST_KEY_PROP],
            source: meta.request,
            snapshot: undefined,
            status: consts_1.REQUEST_STATUS.CREATED,
        };
        data_store_1.default.update(trailDataRequests.store, (0, trail_data_1.getPath)(trailDataRequests, meta.data.reference), item);
        return meta.data.reference;
    }
    return ref;
};
exports.set = set;
const setStatus = (trailDataRequests, status, ref) => {
    try {
        // If no appropriate reference is found, do same as testing if it exists
        const exists = (0, exports.has)(trailDataRequests, ref);
        if (exists) {
            data_store_1.default.set(trailDataRequests.store, (0, utils_1.pathify)(trailDataRequests.path, ref?.[consts_1.REQUEST_KEY_PROP], 'status'), status);
        }
    }
    catch (error) {
        // silent
    }
};
exports.setStatus = setStatus;
// export const getNextKeys = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): UniqueyKey[] => {
//     // const sortedKeys = sortBy(keyedResults, getSortingOrder());
//     // const existingKeys = (sortedKeys || []).filter((key) => Object.keys(this.getAllAsObject(ref)).includes(key));
//     // const newKeys = (sortedKeys || []).filter((key) => !Object.keys(this.getAllAsObject(ref)).includes(key));
//     // // TODO: Doesnt make sense for requests
//     // // const newValidKeys = newKeys.filter((key) => validateItem(keyedResults[key]));
//     // // console.dir({ newKeys, newValidKeys }, { depth: null });
//     // const existingExistingKeysCount = this.count(ref) - existingKeys.length;
//     // const maxNbKeys = getMaxItems() - existingExistingKeysCount;
//     // const acceptedKeys = [...existingKeys, ...newKeys].slice(0, maxNbKeys > 0 ? maxNbKeys : 0);
//     // return acceptedKeys;
//     return [];
// };
exports.default = { create: exports.create, count: exports.count, get: exports.get, getItems: exports.getItems, getItemsList: exports.getItemsList, getReference: exports.getReference, set: exports.set, setStatus: exports.setStatus, getItemsListByStatus: exports.getItemsListByStatus, filterByFlowStart: exports.filterByFlowStart };
//# sourceMappingURL=trail-data-requests.js.map