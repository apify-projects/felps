/* eslint-disable max-len */
import { REQUEST_KEY_PROP, REQUEST_STATUS, REQUEST_UID_KEY } from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import State from '@usefelps/state';
import TrailData from '@usefelps/trail--data';
import * as utils from '@usefelps/utils';
import * as FT from '@usefelps/types';

export const create = (options: FT.TrailDataRequestsOptions): FT.TrailDataRequestsInstance => {
    const { id, type, store } = options;

    const key = `store-trail-data-requests`;
    const name = `trail-data-model-requests`;

    const path = utils.pathify(id, type, 'requests');

    return {
        ...Base.create({ key, name, id }),
        referenceKey: REQUEST_KEY_PROP,
        path,
        store,
    };
};

export const has = (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference): boolean => {
    return State.has(trailDataRequests.store, TrailData.getPath(trailDataRequests, ref));
};

export const get = (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference): FT.TrailDataRequestItem => {
    return State.get<FT.TrailDataRequestItem>(trailDataRequests.store, TrailData.getPath(trailDataRequests, ref));
};

export const getItems = (trailDataRequests: FT.TrailDataRequestsInstance): Record<string, FT.TrailDataRequestItem> => {
    return State.get<Record<string, FT.TrailDataRequestItem>>(trailDataRequests.store, trailDataRequests.path);
};

export const getItemsList = (trailDataRequests: FT.TrailDataRequestsInstance, ref?: FT.ModelReference): FT.TrailDataRequestItem[] => {
    const items = Object.values(getItems(trailDataRequests) || {});
    return ref ? items.filter((item) => utils.isMatch(RequestMeta.create(item.source).data?.reference as FT.ModelReference, ref)) : items;
};

export const getItemsListByStatus = (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus | FT.TrailDataRequestItemStatus[], ref?: FT.ModelReference): FT.TrailDataRequestItem[] => {
    const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean);
    return getItemsList(trailDataRequests, ref).filter((item) => statuses.includes(item.status));
};

export const filterByFlowStart = (item: FT.TrailDataRequestItem) => {
    const meta = RequestMeta.create(item.source);
    return meta.data.flowStart;
};

export const count = (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference): number => {
    return getItemsList(trailDataRequests, ref).length;
};

export const getReference = (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference): FT.ModelReference => {
    const meta = RequestMeta.create((get(trailDataRequests, ref) as FT.TrailDataRequestItem).source);
    return (meta?.data?.reference || {}) as FT.ModelReference;
};

export const set = (trailDataRequests: FT.TrailDataRequestsInstance, request: FT.RequestSource, ref?: FT.ModelReference): FT.ModelReference => {
    const meta = RequestMeta.extend(RequestMeta.create(request), { reference: { [REQUEST_KEY_PROP]: utils.craftUIDKey(REQUEST_UID_KEY), ...ref } });

    if (meta.data.reference) {
        const item: FT.TrailDataRequestItem = {
            id: meta.data.reference?.[REQUEST_KEY_PROP] as string,
            source: meta.request,
            snapshot: undefined,
            status: REQUEST_STATUS.CREATED,
        };

        State.update(trailDataRequests.store, TrailData.getPath(trailDataRequests, meta.data.reference), item);
        return meta.data.reference;
    }

    return ref as FT.ModelReference;
};

export const setStatus = (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus, ref: FT.ModelReference): void => {
    try {
        // If no appropriate reference is found, do same as testing if it exists
        const exists = has(trailDataRequests, ref);
        if (exists) {
            State.set(trailDataRequests.store, utils.pathify(trailDataRequests.path, ref?.[REQUEST_KEY_PROP] as string, 'status'), status);
        }
    } catch (error) {
        // silent
    }
};

export const getStatus = (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference): void => {
    return State.get(trailDataRequests.store, utils.pathify(trailDataRequests.path, ref?.[REQUEST_KEY_PROP] as string, 'status'));
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

export default { create, count, get, getItems, getItemsList, getReference, set, setStatus, getStatus, getItemsListByStatus, filterByFlowStart };
