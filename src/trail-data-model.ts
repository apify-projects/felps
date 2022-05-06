/* eslint-disable max-len */
import isMatch from 'lodash.ismatch';
import hash from 'object-hash';
import { Model } from '.';
import base from './base';
import { MODEL_STATUS, MODEL_UID_KEY, REFERENCE_KEY } from './consts';
import dataStore from './data-store';
import { getPath } from './trail-data';
import { ModelReference, ReallyAny, TrailDataModelInstance, TrailDataModelItem, TrailDataModelItemStatus, TrailDataModelOperation, TrailDataModelOptions } from './types';
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

export const get = <T = unknown>(trailDataModel: TrailDataModelInstance, ref: ModelReference<T>): TrailDataModelItem<T> => {
    return dataStore.get<TrailDataModelItem<T>>(trailDataModel.store, getPath(trailDataModel, ref));
};

export const getItemsList = <T = unknown>(trailDataModel: TrailDataModelInstance, ref?: ModelReference<T>): TrailDataModelItem[] => {
    const entities = dataStore.get<Record<string, TrailDataModelItem>>(trailDataModel.store, trailDataModel.path) || {};
    const items = Object.keys(entities).reduce((list, key) => {
        if (entities[key].model === trailDataModel.model.name) {
            list.push(entities[key]);
        };
        return list;
    }, [] as TrailDataModelItem[]);
    const filteredItems = ref ? items.filter((item) => isMatch(item.reference, ref)) : items;
    return filteredItems;
};

export const getItems = <T = unknown>(trailDataModel: TrailDataModelInstance, ref?: ModelReference<T>): Record<string, TrailDataModelItem> => {
    return getItemsList(trailDataModel, ref).reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
};

export const getItemsListByStatus = (trailDataModel: TrailDataModelInstance, status: TrailDataModelItemStatus | TrailDataModelItemStatus[], ref?: ModelReference): TrailDataModelItem[] => {
    const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean);
    return getItemsList(trailDataModel, ref).filter((item) => statuses.includes(item.status));
};

export const filterByStatus = (...statuses: TrailDataModelItemStatus[]) => (value: ReallyAny) => {
    return statuses.includes(value.status);
};

export const filterByPartial = (partial?: boolean) => (value: ReallyAny) => {
    return value.partial === partial;
};

export const groupByParentHash = (trailDataModel: TrailDataModelInstance, items: TrailDataModelItem[]) => {
    const groups = new Map<string, TrailDataModelItem[]>();
    for (const item of items) {
        const parentReference = Model.referenceFor(trailDataModel.model, item.reference);
        const parentReferenceHash = hash(parentReference);
        // console.log({ parentReferenceHash, parentReference })
        groups.set(parentReferenceHash, [...(groups.get(parentReferenceHash) || []), item]);
    }
    return groups;
};

export const getChildrenItemsList = <T = unknown>(trailDataModel: TrailDataModelInstance, parentRef: ModelReference<T>): TrailDataModelItem[] => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { [trailDataModel.referenceKey as keyof ModelReference<T>]: _, ...reference } = parentRef;
    return getItemsList(trailDataModel, reference as ModelReference<T>);
};

export const boostrapItem = <T = unknown>(trailDataModel: TrailDataModelInstance, data: T, ref?: ModelReference<T>): Partial<TrailDataModelItem<T>> => {
    const key = ref?.[trailDataModel?.referenceKey as keyof ModelReference] as string;

    const item = {
        id: key,
        model: trailDataModel.model?.name,
        reference: ref as ModelReference<T>,
        data,
        partial: false,
        status: MODEL_STATUS.CREATED,
    };

    return item;
};

export const getExistingReference = <T = unknown>(trailDataModel: TrailDataModelInstance, data: T): ModelReference<T> | undefined => {
    const entities = getItemsList(trailDataModel);
    const existingReference = Model.find(trailDataModel.model, entities, data as ReallyAny);
    return existingReference?.reference;
};

export const getReference = <T = unknown>(trailDataModel: TrailDataModelInstance, data: T, ref?: ModelReference<T>): ModelReference<T> => {
    return getExistingReference(trailDataModel, data)
        || { [trailDataModel.referenceKey]: craftUIDKey(MODEL_UID_KEY(trailDataModel.model?.name)), ...(ref || {}) } as ModelReference<T>;
};

export const playOperation = <T = unknown>(trailDataModel: TrailDataModelInstance, op: TrailDataModelOperation['op'], data: T | Partial<T>, ref?: ModelReference<T>): ModelReference<T> => {
    const reference = getReference(trailDataModel, data, ref);
    const item = boostrapItem(trailDataModel, data, reference);

    const operation: TrailDataModelOperation = {
        data,
        op,
        at: new Date().toISOString(),
    };

    dataStore.update(trailDataModel.store, getPath(trailDataModel, reference), item);
    dataStore.push(trailDataModel.store, getPath(trailDataModel, reference, 'operations'), operation);
    return reference;
};

export const set = <T = unknown>(trailDataModel: TrailDataModelInstance, data: T, ref?: ModelReference<T>): ModelReference<T> => {
    const reference = playOperation(trailDataModel, 'SET', data, ref);
    dataStore.set(trailDataModel.store, getPath(trailDataModel, reference, 'partial'), false);
    return reference;
};

export const setPartial = <T = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T>, ref: ModelReference<T>): ModelReference<T> => {
    const reference = playOperation(trailDataModel, 'SET_PARTIAL', data, ref);
    dataStore.set(trailDataModel.store, getPath(trailDataModel, reference, 'partial'), true);
    return reference;
};

export const update = <T = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T>, ref: ModelReference<T>): ModelReference<T> => {
    const reference = playOperation(trailDataModel, 'UPDATE', data, ref);
    dataStore.set(trailDataModel.store, getPath(trailDataModel, reference, 'partial'), false);
    return reference;
};

export const updatePartial = <T = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T>, ref: ModelReference<T>): ModelReference<T> => {
    const reference = playOperation(trailDataModel, 'UPDATE_PARTIAL', data, ref);
    dataStore.set(trailDataModel.store, getPath(trailDataModel, reference, 'partial'), true);
    return reference;
};

export const setStatus = (trailDataModel: TrailDataModelInstance, status: TrailDataModelItemStatus, ref: ModelReference): void => {
    const key = ref?.[trailDataModel?.referenceKey as keyof ModelReference] as string;
    dataStore.set(trailDataModel.store, pathify(trailDataModel.path, key, 'status'), status);
};

export const count = <T = unknown>(trailDataModel: TrailDataModelInstance, ref: ModelReference<T>): number => {
    return getItemsList(trailDataModel, ref).length;
};

export default { create, get, getItems, getItemsList, getItemsListByStatus, getChildrenItemsList, update, updatePartial, set, setStatus, count, setPartial, boostrapItem, filterByStatus, filterByPartial, groupByParentHash, getExistingReference };
