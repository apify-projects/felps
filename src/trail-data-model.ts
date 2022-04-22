/* eslint-disable max-len */
import isMatch from 'lodash.ismatch';
import base from './base';
import { MODEL_UID_KEY, REFERENCE_KEY } from './common/consts';
import { ModelReference, TrailDataModelInstance, TrailDataModelItem, TrailDataModelOptions } from './common/types';
import { craftUIDKey, pathify } from './common/utils';
import dataStore from './data-store';
import { getPath } from './trail-data';

export const create = (options: TrailDataModelOptions): TrailDataModelInstance => {
    const { id, type, model, store } = options;
    const referenceKey = REFERENCE_KEY(model.name);

    const key = `store-trail-data-model-${model.name}`;
    const name = `trail-data-model-${model.name}`;

    const path = pathify(id, type, model.name, 'models');

    return {
        ...base.create({ key, name, id }),
        referenceKey,
        path,
        model,
        store,
    };
};

export const get = <T>(trailData: TrailDataModelInstance, ref: ModelReference<T>): TrailDataModelItem<T> | Record<string, TrailDataModelItem> => {
    return dataStore.get(trailData.store, getPath(trailData, ref));
};

export const getItems = (trailData: TrailDataModelInstance): Record<string, TrailDataModelItem> => {
    return dataStore.get<Record<string, TrailDataModelItem>>(trailData.store, trailData.path);
};

export const getItemsList = <T>(trailData: TrailDataModelInstance, ref?: ModelReference<T>): TrailDataModelItem[] => {
    const items = Object.values(getItems(trailData));
    return ref ? items.filter((item) => isMatch(item.reference, ref)) : items;
};

export const getChildrenItemsList = <T>(trailData: TrailDataModelInstance, parentRef: ModelReference<T>): TrailDataModelItem[] => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { [trailData.referenceKey as keyof ModelReference<T>]: _, ...reference } = parentRef;
    return getItemsList(trailData, reference as ModelReference<T>);
};

export const update = <T>(trailData: TrailDataModelInstance, data: Partial<T>, ref?: ModelReference<T>): ModelReference<T> => {
    dataStore.update(trailData.store, getPath(trailData, ref), { data, reference: ref });
    return ref;
};

export const set = <T>(trailData: TrailDataModelInstance, data: Partial<T>, ref?: ModelReference<T>): ModelReference<T> => {
    const reference = { [trailData.referenceKey]: craftUIDKey(MODEL_UID_KEY(trailData.model?.name)), ...(ref || {}) } as ModelReference<T>;
    return update(trailData, data, reference);
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

export default { create, get, getItems, getItemsList, getChildrenItemsList, update, set, count };
