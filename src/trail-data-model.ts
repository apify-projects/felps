/* eslint-disable max-len */
import isMatch from 'lodash.ismatch';
import base from './base';
import { MODEL_STATUS, MODEL_UID_KEY, REFERENCE_KEY } from './consts';
import dataStore from './data-store';
import { getPath } from './trail-data';
import { ModelReference, TrailDataModelInstance, TrailDataModelItem, TrailDataModelOperation, TrailDataModelItemStatus, TrailDataModelOptions, reallyAny } from './types';
import { craftUIDKey, pathify } from './utils';

export const create = (options: TrailDataModelOptions): TrailDataModelInstance => {
    const { id, type, model, store } = options;
    const referenceKey = REFERENCE_KEY(model.name);

    const key = `store-trail-data-model-${model.name}`;
    const name = `trail-data-model-${model.name}`;

    const path = pathify(id, type, 'models');

    return {
        ...base.create({ key, name, id }),
        referenceKey,
        path,
        model,
        store,
    };
};

export const get = <T = unknown>(trailData: TrailDataModelInstance, ref: ModelReference<T>): TrailDataModelItem<T> => {
    return dataStore.get<TrailDataModelItem<T>>(trailData.store, getPath(trailData, ref));
};

export const getItems = (trailData: TrailDataModelInstance): Record<string, TrailDataModelItem> => {
    return dataStore.get<Record<string, TrailDataModelItem>>(trailData.store, trailData.path) || {};
};

export const getItemsList = <T = unknown>(trailData: TrailDataModelInstance, ref?: ModelReference<T>): TrailDataModelItem[] => {
    const items = Object.values(getItems(trailData));
    return ref ? items.filter((item) => isMatch(item.reference, ref)) : items;
};

export const getItemsListByStatus = (trailData: TrailDataModelInstance, status: TrailDataModelItemStatus | TrailDataModelItemStatus[], ref?: ModelReference): TrailDataModelItem[] => {
    const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean);
    return getItemsList(trailData, ref).filter((item) => statuses.includes(item.status));
};

export const filterByStatus = (...statuses: TrailDataModelItemStatus[]) => (value: reallyAny) => {
    return statuses.includes(value.status);
};

export const filterByPartial = (partial?: boolean) => (value: reallyAny) => {
    return value.partial === partial;
};

export const getChildrenItemsList = <T = unknown>(trailData: TrailDataModelInstance, parentRef: ModelReference<T>): TrailDataModelItem[] => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { [trailData.referenceKey as keyof ModelReference<T>]: _, ...reference } = parentRef;
    return getItemsList(trailData, reference as ModelReference<T>);
};

export const boostrapItem = <T = unknown>(trailData: TrailDataModelInstance, data: T, ref?: ModelReference<T>): Partial<TrailDataModelItem<T>> => {
    const key = ref?.[trailData?.referenceKey as keyof ModelReference] as string;

    const item = {
        id: key,
        model: trailData.model?.name,
        reference: ref as ModelReference<T>,
        data,
        partial: false,
        status: MODEL_STATUS.CREATED,
    };

    return item;
};

export const set = <T = unknown>(trailData: TrailDataModelInstance, data: T, ref?: ModelReference<T>): ModelReference<T> => {
    const reference = { [trailData.referenceKey]: craftUIDKey(MODEL_UID_KEY(trailData.model?.name)), ...(ref || {}) } as ModelReference<T>;
    const item = boostrapItem(trailData, data, reference);

    const operation: TrailDataModelOperation = {
        data,
        op: 'SET',
        at: new Date().toISOString(),
    };

    dataStore.update(trailData.store, getPath(trailData, reference), item);
    dataStore.push(trailData.store, getPath(trailData, reference, 'operations'), operation);
    dataStore.set(trailData.store, getPath(trailData, reference, 'partial'), false);
    return reference;
};

export const setPartial = <T = unknown>(trailData: TrailDataModelInstance, data: Partial<T>, ref: ModelReference<T>): ModelReference<T> => {
    const reference = { [trailData.referenceKey]: craftUIDKey(MODEL_UID_KEY(trailData.model?.name)), ...(ref || {}) } as ModelReference<T>;
    const item = boostrapItem(trailData, data, reference);

    const operation: TrailDataModelOperation = {
        data,
        op: 'SET_PARTIAL',
        at: new Date().toISOString(),
    };

    dataStore.update(trailData.store, getPath(trailData, reference), item);
    dataStore.push(trailData.store, getPath(trailData, reference, 'operations'), operation);
    dataStore.set(trailData.store, getPath(trailData, reference, 'partial'), true);
    return reference;
};

export const update = <T = unknown>(trailData: TrailDataModelInstance, data: Partial<T>, ref: ModelReference<T>): ModelReference<T> => {
    const reference = { [trailData.referenceKey]: craftUIDKey(MODEL_UID_KEY(trailData.model?.name)), ...(ref || {}) } as ModelReference<T>;
    const item = boostrapItem(trailData, data, reference);

    const operation: TrailDataModelOperation = {
        data,
        op: 'UPDATE',
        at: new Date().toISOString(),
    };

    dataStore.update(trailData.store, getPath(trailData, reference), item);
    dataStore.push(trailData.store, getPath(trailData, reference, 'operations'), operation);
    dataStore.set(trailData.store, getPath(trailData, reference, 'partial'), false);
    return reference;
};

export const setStatus = (trailData: TrailDataModelInstance, status: TrailDataModelItemStatus, ref: ModelReference): void => {
    const key = ref?.[trailData?.referenceKey as keyof ModelReference] as string;
    dataStore.set(trailData.store, pathify(trailData.path, key, 'status'), status);
};

export const count = <T>(trailData: TrailDataModelInstance, ref: ModelReference<T>): number => {
    return getItemsList(trailData, ref).length;
};

// export const getNextItemKeys = <T>(trailData: TrailDataModelInstance, ref: ModelReference<T>): UniqueyKey[] => {
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

export default { create, get, getItems, getItemsList, getItemsListByStatus, getChildrenItemsList, update, set, setStatus, count, setPartial, boostrapItem, filterByStatus, filterByPartial };
