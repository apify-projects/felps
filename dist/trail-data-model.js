"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.setStatus = exports.updatePartial = exports.update = exports.setPartial = exports.set = exports.playOperation = exports.getReference = exports.getExistingReference = exports.boostrapItem = exports.getChildrenItemsList = exports.groupByParentHash = exports.filterByPartial = exports.filterByStatus = exports.getItemsListByStatus = exports.getItems = exports.getItemsList = exports.get = exports.create = void 0;
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const lodash_ismatch_1 = tslib_1.__importDefault(require("lodash.ismatch"));
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const data_store_1 = tslib_1.__importDefault(require("./data-store"));
const trail_data_1 = require("./trail-data");
const utils_1 = require("./utils");
const create = (options) => {
    const { id, type, model, store } = options;
    const referenceKey = (0, consts_1.REFERENCE_KEY)(model.name);
    const key = `store-trail-data-model-${model.name}`;
    const name = `trail-data-model-${model.name}`;
    const path = (0, utils_1.pathify)(id, type, 'models');
    return {
        ...base_1.default.create({ key, name, id }),
        referenceKey,
        path,
        model,
        store,
    };
};
exports.create = create;
const get = (trailDataModel, ref) => {
    return data_store_1.default.get(trailDataModel.store, (0, trail_data_1.getPath)(trailDataModel, ref));
};
exports.get = get;
const getItemsList = (trailDataModel, ref) => {
    const entities = data_store_1.default.get(trailDataModel.store, trailDataModel.path) || {};
    const items = Object.keys(entities).reduce((list, key) => {
        if (entities[key].model === trailDataModel.model.name) {
            list.push(entities[key]);
        }
        ;
        return list;
    }, []);
    const filteredItems = ref ? items.filter((item) => (0, lodash_ismatch_1.default)(item.reference, ref)) : items;
    return filteredItems;
};
exports.getItemsList = getItemsList;
const getItems = (trailDataModel, ref) => {
    return (0, exports.getItemsList)(trailDataModel, ref).reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
};
exports.getItems = getItems;
const getItemsListByStatus = (trailDataModel, status, ref) => {
    const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean);
    return (0, exports.getItemsList)(trailDataModel, ref).filter((item) => statuses.includes(item.status));
};
exports.getItemsListByStatus = getItemsListByStatus;
const filterByStatus = (...statuses) => (value) => {
    return statuses.includes(value.status);
};
exports.filterByStatus = filterByStatus;
const filterByPartial = (partial) => (value) => {
    return value.partial === partial;
};
exports.filterByPartial = filterByPartial;
const groupByParentHash = (trailDataModel, items) => {
    const groups = new Map();
    for (const item of items) {
        const parentReference = _1.Model.referenceFor(trailDataModel.model, item.reference);
        const parentReferenceHash = (0, object_hash_1.default)(parentReference);
        // console.log({ parentReferenceHash, parentReference })
        groups.set(parentReferenceHash, [...(groups.get(parentReferenceHash) || []), item]);
    }
    return groups;
};
exports.groupByParentHash = groupByParentHash;
const getChildrenItemsList = (trailDataModel, parentRef) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { [trailDataModel.referenceKey]: _, ...reference } = parentRef;
    return (0, exports.getItemsList)(trailDataModel, reference);
};
exports.getChildrenItemsList = getChildrenItemsList;
const boostrapItem = (trailDataModel, data, ref) => {
    const key = ref?.[trailDataModel?.referenceKey];
    const item = {
        id: key,
        model: trailDataModel.model?.name,
        reference: ref,
        data,
        partial: false,
        status: consts_1.MODEL_STATUS.CREATED,
    };
    return item;
};
exports.boostrapItem = boostrapItem;
const getExistingReference = (trailDataModel, data) => {
    const entities = (0, exports.getItemsList)(trailDataModel);
    const existingReference = _1.Model.find(trailDataModel.model, entities, data);
    return existingReference?.reference;
};
exports.getExistingReference = getExistingReference;
const getReference = (trailDataModel, data, ref) => {
    return (0, exports.getExistingReference)(trailDataModel, data)
        || { [trailDataModel.referenceKey]: (0, utils_1.craftUIDKey)((0, consts_1.MODEL_UID_KEY)(trailDataModel.model?.name)), ...(ref || {}) };
};
exports.getReference = getReference;
const playOperation = (trailDataModel, op, data, ref) => {
    const reference = (0, exports.getReference)(trailDataModel, data, ref);
    const item = (0, exports.boostrapItem)(trailDataModel, data, reference);
    const operation = {
        data,
        op,
        at: new Date().toISOString(),
    };
    data_store_1.default.update(trailDataModel.store, (0, trail_data_1.getPath)(trailDataModel, reference), item);
    data_store_1.default.push(trailDataModel.store, (0, trail_data_1.getPath)(trailDataModel, reference, 'operations'), operation);
    return reference;
};
exports.playOperation = playOperation;
const set = (trailDataModel, data, ref) => {
    const reference = (0, exports.playOperation)(trailDataModel, 'SET', data, ref);
    data_store_1.default.set(trailDataModel.store, (0, trail_data_1.getPath)(trailDataModel, reference, 'partial'), false);
    return reference;
};
exports.set = set;
const setPartial = (trailDataModel, data, ref) => {
    const reference = (0, exports.playOperation)(trailDataModel, 'SET_PARTIAL', data, ref);
    data_store_1.default.set(trailDataModel.store, (0, trail_data_1.getPath)(trailDataModel, reference, 'partial'), true);
    return reference;
};
exports.setPartial = setPartial;
const update = (trailDataModel, data, ref) => {
    const reference = (0, exports.playOperation)(trailDataModel, 'UPDATE', data, ref);
    data_store_1.default.set(trailDataModel.store, (0, trail_data_1.getPath)(trailDataModel, reference, 'partial'), false);
    return reference;
};
exports.update = update;
const updatePartial = (trailDataModel, data, ref) => {
    const reference = (0, exports.playOperation)(trailDataModel, 'UPDATE_PARTIAL', data, ref);
    data_store_1.default.set(trailDataModel.store, (0, trail_data_1.getPath)(trailDataModel, reference, 'partial'), true);
    return reference;
};
exports.updatePartial = updatePartial;
const setStatus = (trailDataModel, status, ref) => {
    const key = ref?.[trailDataModel?.referenceKey];
    data_store_1.default.set(trailDataModel.store, (0, utils_1.pathify)(trailDataModel.path, key, 'status'), status);
};
exports.setStatus = setStatus;
const count = (trailDataModel, ref) => {
    return (0, exports.getItemsList)(trailDataModel, ref).length;
};
exports.count = count;
exports.default = { create: exports.create, get: exports.get, getItems: exports.getItems, getItemsList: exports.getItemsList, getItemsListByStatus: exports.getItemsListByStatus, getChildrenItemsList: exports.getChildrenItemsList, update: exports.update, updatePartial: exports.updatePartial, set: exports.set, setStatus: exports.setStatus, count: exports.count, setPartial: exports.setPartial, boostrapItem: exports.boostrapItem, filterByStatus: exports.filterByStatus, filterByPartial: exports.filterByPartial, groupByParentHash: exports.groupByParentHash, getExistingReference: exports.getExistingReference };
//# sourceMappingURL=trail-data-model.js.map