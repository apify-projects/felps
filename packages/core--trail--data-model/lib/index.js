"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.setStatus = exports.updatePartial = exports.update = exports.setPartial = exports.set = exports.playOperation = exports.getReference = exports.getExistingReference = exports.boostrapItem = exports.getChildrenItemsList = exports.groupByParentHash = exports.filterByPartial = exports.filterByStatus = exports.getItemsListByStatus = exports.getItems = exports.getItemsList = exports.get = exports.create = void 0;
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const core__model_1 = tslib_1.__importDefault(require("@usefelps/core--model"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__constants_1 = require("@usefelps/core--constants");
const core__store__data_1 = tslib_1.__importDefault(require("@usefelps/core--store--data"));
const core__trail__data_1 = require("@usefelps/core--trail--data");
const helper__utils_1 = require("@usefelps/helper--utils");
const create = (options) => {
    const { id, type, model, store } = options;
    const referenceKey = (0, core__constants_1.REFERENCE_KEY)(model.name);
    const key = `store-trail-data-model-${model.name}`;
    const name = `trail-data-model-${model.name}`;
    const path = (0, helper__utils_1.pathify)(id, type, 'models');
    return {
        ...core__instance_base_1.default.create({ key, name, id }),
        referenceKey,
        path,
        model,
        store,
    };
};
exports.create = create;
const get = (trailDataModel, ref) => {
    return core__store__data_1.default.get(trailDataModel.store, (0, core__trail__data_1.getPath)(trailDataModel, ref));
};
exports.get = get;
const getItemsList = (trailDataModel, ref) => {
    const entities = core__store__data_1.default.get(trailDataModel.store, trailDataModel.path) || {};
    // console.log('entities', entities);
    const items = Object.keys(entities).reduce((list, key) => {
        if (entities[key].model === trailDataModel.model.name) {
            list.push(entities[key]);
        }
        ;
        return list;
    }, []);
    const filteredItems = ref ? items.filter((item) => (0, helper__utils_1.isMatch)(item.reference, ref)) : items;
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
        const parentReference = core__model_1.default.referenceFor(trailDataModel.model, item.reference);
        const parentReferenceHash = (0, helper__utils_1.hash)(parentReference);
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
        status: core__constants_1.MODEL_STATUS.CREATED,
    };
    return item;
};
exports.boostrapItem = boostrapItem;
const getExistingReference = (trailDataModel, data) => {
    const entities = (0, exports.getItemsList)(trailDataModel);
    const existingReference = core__model_1.default.find(trailDataModel.model, entities, { data });
    return existingReference?.reference;
};
exports.getExistingReference = getExistingReference;
const getReference = (trailDataModel, data, ref) => {
    return (0, exports.getExistingReference)(trailDataModel, data)
        || { [trailDataModel.referenceKey]: (0, helper__utils_1.craftUIDKey)((0, core__constants_1.MODEL_UID_KEY)(trailDataModel.model?.name)), ...(ref || {}) };
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
    core__store__data_1.default.update(trailDataModel.store, (0, core__trail__data_1.getPath)(trailDataModel, reference), item);
    core__store__data_1.default.push(trailDataModel.store, (0, core__trail__data_1.getPath)(trailDataModel, reference, 'operations'), operation);
    return reference;
};
exports.playOperation = playOperation;
const set = (trailDataModel, data, ref) => {
    const reference = (0, exports.playOperation)(trailDataModel, 'SET', data, ref);
    core__store__data_1.default.set(trailDataModel.store, (0, core__trail__data_1.getPath)(trailDataModel, reference, 'partial'), false);
    return reference;
};
exports.set = set;
const setPartial = (trailDataModel, data, ref) => {
    const reference = (0, exports.playOperation)(trailDataModel, 'SET_PARTIAL', data, ref);
    core__store__data_1.default.set(trailDataModel.store, (0, core__trail__data_1.getPath)(trailDataModel, reference, 'partial'), true);
    return reference;
};
exports.setPartial = setPartial;
const update = (trailDataModel, data, ref) => {
    const reference = (0, exports.playOperation)(trailDataModel, 'UPDATE', data, ref);
    core__store__data_1.default.set(trailDataModel.store, (0, core__trail__data_1.getPath)(trailDataModel, reference, 'partial'), false);
    return reference;
};
exports.update = update;
const updatePartial = (trailDataModel, data, ref) => {
    const reference = (0, exports.playOperation)(trailDataModel, 'UPDATE_PARTIAL', data, ref);
    core__store__data_1.default.set(trailDataModel.store, (0, core__trail__data_1.getPath)(trailDataModel, reference, 'partial'), true);
    return reference;
};
exports.updatePartial = updatePartial;
const setStatus = (trailDataModel, status, ref) => {
    const key = ref?.[trailDataModel?.referenceKey];
    core__store__data_1.default.set(trailDataModel.store, (0, helper__utils_1.pathify)(trailDataModel.path, key, 'status'), status);
};
exports.setStatus = setStatus;
const count = (trailDataModel, ref) => {
    return (0, exports.getItemsList)(trailDataModel, ref).length;
};
exports.count = count;
exports.default = { create: exports.create, get: exports.get, getItems: exports.getItems, getItemsList: exports.getItemsList, getItemsListByStatus: exports.getItemsListByStatus, getChildrenItemsList: exports.getChildrenItemsList, update: exports.update, updatePartial: exports.updatePartial, set: exports.set, setStatus: exports.setStatus, count: exports.count, setPartial: exports.setPartial, boostrapItem: exports.boostrapItem, filterByStatus: exports.filterByStatus, filterByPartial: exports.filterByPartial, groupByParentHash: exports.groupByParentHash, getExistingReference: exports.getExistingReference };
//# sourceMappingURL=index.js.map