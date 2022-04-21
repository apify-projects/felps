/* eslint-disable max-len */
import isMatch from 'lodash.ismatch';
import { RequestMeta } from '.';
import base from './base';
import { REQUEST_STATUS, REQUEST_UID_KEY } from './common/consts';
import { ModelReference, RequestSource, TrailDataRequestItem, TrailDataRequestItemStatus, TrailDataRequestsInstance, TrailDataRequestsOptions } from './common/types';
import { craftUIDKey, pathify } from './common/utils';
import dataStore from './data-store';
import requestMeta from './request-meta';
import { getPath } from './trail-data';

export const create = (options?: TrailDataRequestsOptions): TrailDataRequestsInstance => {
    const { id, type, store } = options;

    const key = `store-trail-data-requests`;
    const name = `trail-data-model-requests`;

    const path = pathify(id, type, 'requests');

    return {
        ...base.create({ key, name, id }),
        referenceKey: 'requestKey',
        path,
        store,
    };
};

export const get = (trailDataRequests: TrailDataRequestsInstance, ref?: ModelReference): TrailDataRequestItem | Record<string, TrailDataRequestItem> => {
    return dataStore.get<TrailDataRequestItem>(trailDataRequests.store, getPath(trailDataRequests, ref));
};

export const getItems = (trailDataRequests: TrailDataRequestsInstance): Record<string, TrailDataRequestItem> => {
    return dataStore.get<Record<string, TrailDataRequestItem>>(trailDataRequests.store, trailDataRequests.path);
};

export const getItemsList = (trailDataRequests: TrailDataRequestsInstance, ref?: ModelReference): TrailDataRequestItem[] => {
    const items = Object.values(getItems(trailDataRequests) || {});
    return ref ? items.filter((item) => isMatch(requestMeta.create(item.source).data?.reference, ref)) : items;
};

export const getItemsListByStatus = (trailDataRequests: TrailDataRequestsInstance, status: TrailDataRequestItemStatus, ref?: ModelReference): TrailDataRequestItem[] => {
    return getItemsList(trailDataRequests, ref).filter((item) => item.status === status);
};

export const count = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): number => {
    return getItemsList(trailDataRequests, ref).length;
};

export const getReference = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): ModelReference => {
    const meta = requestMeta.create((get(trailDataRequests, ref) as TrailDataRequestItem).source);
    return (meta?.data?.reference || {}) as ModelReference;
};

export const set = (trailDataRequests: TrailDataRequestsInstance, request: RequestSource, ref?: ModelReference): ModelReference => {
    const meta = RequestMeta.extend(RequestMeta.create(request), { reference: { requestKey: craftUIDKey(REQUEST_UID_KEY), ...ref } });

    const item: TrailDataRequestItem = {
        id: meta.data.reference.requestKey,
        source: meta.request,
        status: REQUEST_STATUS.CREATED,
    };

    dataStore.update(trailDataRequests.store, getPath(trailDataRequests, meta.data.reference), item);
    return meta.data.reference;
};

export const setStatus = (trailDataRequests: TrailDataRequestsInstance, status: TrailDataRequestItemStatus, ref: ModelReference): void => {
    dataStore.set(trailDataRequests.store, pathify(trailDataRequests.path, ref.requestKey, 'status'), status);
};

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

export default { create, count, get, getItems, getItemsList, getReference, set, setStatus, getItemsListByStatus };
