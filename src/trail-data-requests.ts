/* eslint-disable max-len */
import isMatch from 'lodash.ismatch';
import { RequestMeta } from '.';
import base from './base';
import { ModelReference, RequestSource, TrailDataRequestsInstance, TrailDataRequestsOptions } from './common/types';
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
        path,
        store,
    };
};

export const getRequest = (trailDataRequests: TrailDataRequestsInstance, ref?: ModelReference): RequestSource | Record<string, RequestSource> => {
    return dataStore.get<RequestSource>(trailDataRequests.store, getPath(trailDataRequests, ref));
};

export const getRequestItems = (trailDataRequests: TrailDataRequestsInstance): Record<string, RequestSource> => {
    return getRequest(trailDataRequests) as Record<string, RequestSource>;
};

export const getRequestItemsList = (trailDataRequests: TrailDataRequestsInstance, ref?: ModelReference): RequestSource[] => {
    const items = Object.values(getRequestItems(trailDataRequests) || {});
    return ref ? items.filter((item) => isMatch(requestMeta.create(item).data?.reference, ref)) : items;
};

export const countRequests = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): number => {
    return getRequestItemsList(trailDataRequests, ref).length;
};

export const getRequestReference = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): ModelReference => {
    const meta = requestMeta.create(getRequest(trailDataRequests, ref) as RequestSource);
    return (meta?.data?.reference || {}) as ModelReference;
};

export const setRequest = (trailDataRequests: TrailDataRequestsInstance, request: RequestSource, ref?: Partial<ModelReference>): ModelReference => {
    const meta = RequestMeta.extend(RequestMeta.create(request), { reference: { requestKey: craftUIDKey(), ...ref } });
    dataStore.update(trailDataRequests.store, getPath(trailDataRequests, meta.data.reference), meta.request);
    return meta.data.reference;
};

// export const getNextRequestKeys = (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference): UniqueyKey[] => {
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

export default { create, countRequests, getRequest, getRequestItems, getRequestItemsList, getRequestReference, setRequest };
