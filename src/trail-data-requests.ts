/* eslint-disable max-len */
import isMatch from 'lodash.ismatch';
import { RequestMeta } from '.';
import base from './base';
import { REQUEST_KEY_PROP, REQUEST_STATUS, REQUEST_UID_KEY } from './consts';
import { ModelReference, RequestSource, TrailDataRequestItem, TrailDataRequestItemStatus, TrailDataRequestsInstance, TrailDataRequestsOptions } from './types';
import { craftUIDKey, pathify } from './utils';
import dataStore from './data-store';
import requestMeta from './request-meta';
import { getPath } from './trail-data';

export const create = (options: TrailDataRequestsOptions): TrailDataRequestsInstance => {
    const { id, type, store } = options;

    const key = `store-trail-data-requests`;
    const name = `trail-data-model-requests`;

    const path = pathify(id, type, 'requests');

    return {
        ...base.create({ key, name, id }),
        referenceKey: REQUEST_KEY_PROP,
        path,
        store,
    };
};

export const has = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): boolean => {
    return dataStore.has(trailDataRequests.store, getPath(trailDataRequests, ref));
};

export const get = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): TrailDataRequestItem => {
    return dataStore.get<TrailDataRequestItem>(trailDataRequests.store, getPath(trailDataRequests, ref));
};

export const getItems = (trailDataRequests: TrailDataRequestsInstance): Record<string, TrailDataRequestItem> => {
    return dataStore.get<Record<string, TrailDataRequestItem>>(trailDataRequests.store, trailDataRequests.path);
};

export const getItemsList = (trailDataRequests: TrailDataRequestsInstance, ref?: ModelReference): TrailDataRequestItem[] => {
    const items = Object.values(getItems(trailDataRequests) || {});
    return ref ? items.filter((item) => isMatch(requestMeta.create(item.source).data?.reference as ModelReference, ref)) : items;
};

export const getItemsListByStatus = (trailDataRequests: TrailDataRequestsInstance, status: TrailDataRequestItemStatus | TrailDataRequestItemStatus[], ref?: ModelReference): TrailDataRequestItem[] => {
    const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean);
    return getItemsList(trailDataRequests, ref).filter((item) => statuses.includes(item.status));
};

export const count = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): number => {
    return getItemsList(trailDataRequests, ref).length;
};

export const getReference = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): ModelReference => {
    const meta = requestMeta.create((get(trailDataRequests, ref) as TrailDataRequestItem).source);
    return (meta?.data?.reference || {}) as ModelReference;
};

export const set = (trailDataRequests: TrailDataRequestsInstance, request: RequestSource, ref?: ModelReference): ModelReference => {
    const meta = RequestMeta.extend(RequestMeta.create(request), { reference: { [REQUEST_KEY_PROP]: craftUIDKey(REQUEST_UID_KEY), ...ref } });

    if (meta.data.reference) {
        const item: TrailDataRequestItem = {
            id: meta.data.reference?.[REQUEST_KEY_PROP] as string,
            source: meta.request,
            snapshot: undefined,
            status: REQUEST_STATUS.CREATED,
        };

        dataStore.update(trailDataRequests.store, getPath(trailDataRequests, meta.data.reference), item);
        return meta.data.reference;
    }

    return ref as ModelReference;
};

export const setStatus = (trailDataRequests: TrailDataRequestsInstance, status: TrailDataRequestItemStatus, ref: ModelReference): void => {
    try {
        // If no appropriate reference is found, do same as testing if it exists
        const exists = has(trailDataRequests, ref);
        if (exists) {
            dataStore.set(trailDataRequests.store, pathify(trailDataRequests.path, ref?.[REQUEST_KEY_PROP] as string, 'status'), status);
        }
    } catch (error) {
        // silent
    }
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
