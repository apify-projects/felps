/* eslint-disable max-len */
import isMatch from 'lodash.ismatch';
import base from './base';
import { REFERENCE_KEY } from './common/consts';
import { ModelReference, RequestSource, TrailDataInstance, TrailDataModelItem, TrailDataModelPathsMethods, TrailDataOptions, TrailModelPathsOptions } from './common/types';
import { concatAsUniqueArray, craftUIDKey, pathify } from './common/utils';
import dataStore from './data-store';
import requestMeta from './request-meta';

export const DefaultUpdateMerger = (existingValue, newValue) => {
    if (!newValue && typeof existingValue !== 'number') return existingValue;
    if (Array.isArray(newValue)) {
        return concatAsUniqueArray(existingValue, newValue);
    }
    return undefined;
};

export const create = <ReferenceType = Record<string, unknown>>(options?: TrailDataOptions): TrailDataInstance<ReferenceType> => {
    const { path, model, store } = options;
    const referenceKey = REFERENCE_KEY(model.name);
    const fragments = getTrailDataFragments<ReferenceType>({ name: model.name, path });

    return {
        ...base.create({ key: 'store-trail-data', name: 'trail-data' }),
        referenceKey,
        path,
        fragments,
        model,
        store,
    };
};

// paths ------------------------------------------------------------------------------------------------------------

export const getItemPath = <T>(trailData: TrailDataInstance<T>, ref: ModelReference<T>): string => {
    return trailData.fragments.ITEMS(ref);
};

export const getRequestPath = <T>(trailData: TrailDataInstance<T>, ref: ModelReference<T>): string => {
    return trailData.fragments.REQUESTS(ref);
};

// items -------------------------------------------------------------------------------------------------------------

export const get = <T>(trailData: TrailDataInstance<T>, ref?: ModelReference<T>): TrailDataModelItem<T> | Record<string, TrailDataModelItem> => {
    return dataStore.get(trailData.store, getItemPath(trailData, ref));
};

export const getItems = <T>(trailData: TrailDataInstance<T>): Record<string, TrailDataModelItem> => {
    return get(trailData) as Record<string, TrailDataModelItem>;
};

export const getItemsList = <T>(trailData: TrailDataInstance<T>, ref?: Partial<ModelReference<T>>): TrailDataModelItem[] => {
    const items = Object.values(getItems(trailData));
    return ref ? items.filter((item) => isMatch(item.reference, ref)) : items;
};

export const getChildrenItemsList = <T>(trailData: TrailDataInstance<T>, parentRef: ModelReference<T>): TrailDataModelItem[] => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { [trailData.referenceKey as keyof ModelReference<T>]: _, ...reference } = parentRef;
    return getItemsList(trailData, reference as Partial<ModelReference<T>>);
};

export const update = <T>(trailData: TrailDataInstance<T>, data: Partial<T>, ref?: ModelReference<T>): ModelReference<T> => {
    return dataStore.update(trailData.store, getItemPath(trailData, ref), { data, reference: ref });
};

export const set = <T>(trailData: TrailDataInstance<T>, data: Partial<T>, ref?: ModelReference<T>): ModelReference<T> => {
    const reference = { [trailData.referenceKey]: craftUIDKey(), ...(ref || {}) } as ModelReference<T>;
    return update(trailData, data, reference);
};

export const count = <T>(trailData: TrailDataInstance<T>, ref: ModelReference<T>): number => {
    return getItemsList(trailData, ref).length;
};

// export const getNextItemKeys = <T>(trailData: TrailDataInstance<T>, ref: ModelReference<T>): UniqueyKey[] => {
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

// requests -----------------------------------------------------------------------------------------------------------

export const getRequest = <T>(trailData: TrailDataInstance<T>, ref?: ModelReference<T>): RequestSource | Record<string, RequestSource> => {
    return dataStore.get(getRequestPath(trailData, ref));
};

export const getRequestItems = <T>(trailData: TrailDataInstance<T>): Record<string, RequestSource> => {
    return getRequest(trailData) as Record<string, RequestSource>;
};

export const getRequestItemsList = <T>(trailData: TrailDataInstance<T>, ref?: ModelReference<T>): RequestSource[] => {
    const items = Object.values(getRequestItems(trailData));
    return ref ? items.filter((item) => isMatch(requestMeta.create(item).data?.reference, ref)) : items;
};

export const countRequests = <T>(trailData: TrailDataInstance<T>, ref: ModelReference<T>): number => {
    return getRequestItemsList(trailData, ref).length;
};

export const getRequestReference = <T>(trailData: TrailDataInstance<T>, ref: ModelReference<T>): ModelReference<T> => {
    const meta = requestMeta.create(getRequest(trailData, ref) as RequestSource);
    return (meta?.data?.reference || {}) as ModelReference<T>;
};

export const setRequest = <T>(trailData: TrailDataInstance<T>, request: RequestSource, ref?: ModelReference<T>): ModelReference<T> => {
    const reference = { requestKey: craftUIDKey(), ...(ref || {}) } as ModelReference<T>;
    return dataStore.update(trailData.store, getRequestPath(trailData, reference), request || {});
};

// export const getNextRequestKeys = <T>(trailData: TrailDataInstance<T>, ref: ModelReference<T>): UniqueyKey[] => {
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

// ---------------------------------------------------------------------------------------------------------------------

const getTrailDataFragments = <T>(options: TrailModelPathsOptions): TrailDataModelPathsMethods<T> => {
    const { name, path } = options;

    const basePath = pathify(path, name);
    const referenceKey = REFERENCE_KEY(name);

    return {
        ITEMS: (reference) => pathify(basePath, 'items', reference?.[referenceKey]),
        REQUESTS: (reference) => pathify(basePath, 'requests', reference?.[referenceKey]),
    };
};

export default { create, get, getItems, getItemsList, getChildrenItemsList, update, set, count, countRequests, getRequest, getRequestItems, getRequestItemsList, getRequestReference, setRequest };
