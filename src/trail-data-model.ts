/* eslint-disable max-len */
import isMatch from 'lodash.ismatch';
import base from './base';
import { MODEL_STATUS, MODEL_UID_KEY, REFERENCE_KEY } from './consts';
import dataStore from './data-store';
import { getPath } from './trail-data';
import { ModelReference, TrailDataModelInstance, TrailDataModelItem, TrailDataModelOperation, TrailDataModelItemStatus, TrailDataModelOptions } from './types';
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

export const getChildrenItemsList = <T = unknown>(trailData: TrailDataModelInstance, parentRef: ModelReference<T>): TrailDataModelItem[] => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { [trailData.referenceKey as keyof ModelReference<T>]: _, ...reference } = parentRef;
    return getItemsList(trailData, reference as ModelReference<T>);
};

export const set = <T = unknown>(trailData: TrailDataModelInstance, data: Partial<T>, ref?: ModelReference<T>): ModelReference<T> => {
    const reference = { [trailData.referenceKey]: craftUIDKey(MODEL_UID_KEY(trailData.model?.name)), ...(ref || {}) } as ModelReference<T>;
    const key = reference?.[trailData?.referenceKey as keyof ModelReference] as string;

    const operation: TrailDataModelOperation = {
        data,
        op: 'SET',
        at: new Date().toISOString(),
    };

    const item: TrailDataModelItem<T> = {
        id: key,
        model: trailData.model?.name,
        reference,
        data,
        operations: [operation],
        status: MODEL_STATUS.CREATED,
    };

    dataStore.set(trailData.store, getPath(trailData, reference), item);
    return reference;
};

export const setStatus = (trailData: TrailDataModelInstance, status: TrailDataModelItemStatus, ref: ModelReference): void => {
    const key = ref?.[trailData?.referenceKey as keyof ModelReference] as string;
    dataStore.set(trailData.store, pathify(trailData.path, key, 'status'), status);
};

export const update = <T = unknown>(trailData: TrailDataModelInstance, data: Partial<T>, ref: ModelReference<T>) => {
    dataStore.update(trailData.store, getPath(trailData, ref, 'data'), data);

    const operation: TrailDataModelOperation = {
        data,
        op: 'UPDATE',
        at: new Date().toISOString(),
    };
    dataStore.push(trailData.store, getPath(trailData, ref, 'operations'), operation);

    setStatus(trailData, MODEL_STATUS.UPDATED, ref);

    return ref;
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

export default { create, get, getItems, getItemsList, getItemsListByStatus, getChildrenItemsList, update, set, setStatus, count };
