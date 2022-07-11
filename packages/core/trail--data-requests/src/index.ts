/* eslint-disable max-len */
import { REQUEST_KEY_PROP, REQUEST_STATUS, REQUEST_UID_KEY } from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import State from '@usefelps/state';
import * as utils from '@usefelps/utils';
import * as FT from '@usefelps/types';

export const create = (options: FT.TrailDataRequestsOptions): FT.TrailDataRequestsInstance => {
    const { id, type, state } = options;

    const key = `state-trail-data-requests`;
    const name = `trail-data-model-requests`;

    const path = utils.pathify(id, type, 'requests');

    return {
        ...Base.create({ key, name, id }),
        path,
        state,
    };
};

export const getPath = (trailDataRequests: FT.TrailDataRequestsInstance, requestKey: string, ...segments: string[]): string => {
    return utils.pathify(trailDataRequests.path, requestKey, ...segments);
}

export const has = (trailDataRequests: FT.TrailDataRequestsInstance, requestKey: string): boolean => {
    return State.has(trailDataRequests.state, getPath(trailDataRequests, requestKey));
};

export const get = (trailDataRequests: FT.TrailDataRequestsInstance, requestKey: string): FT.TrailDataRequestItem => {
    return State.get<FT.TrailDataRequestItem>(trailDataRequests.state, getPath(trailDataRequests, requestKey));
};

export const getItems = (trailDataRequests: FT.TrailDataRequestsInstance): Record<string, FT.TrailDataRequestItem> => {
    return State.get<Record<string, FT.TrailDataRequestItem>>(trailDataRequests.state, trailDataRequests.path);
};

export const getItemsList = (trailDataRequests: FT.TrailDataRequestsInstance): FT.TrailDataRequestItem[] => {
    return Object.values(getItems(trailDataRequests) || {});
};

export const getItemsListByStatus = (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus | FT.TrailDataRequestItemStatus[]): FT.TrailDataRequestItem[] => {
    const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean);
    return getItemsList(trailDataRequests).filter((item) => statuses.includes(item.status));
};

export const filterByFlowStart = (item: FT.TrailDataRequestItem) => {
    const meta = RequestMeta.create(item.source);
    return meta.data.startFlow;
};

export const count = (trailDataRequests: FT.TrailDataRequestsInstance): number => {
    return getItemsList(trailDataRequests).length;
};

export const set = (trailDataRequests: FT.TrailDataRequestsInstance, request: FT.RequestSource, requestKey: string = utils.craftUIDKey(REQUEST_UID_KEY)): string => {
    const meta = RequestMeta.extend(RequestMeta.create(request), { [REQUEST_KEY_PROP]: requestKey });

    const item: FT.TrailDataRequestItem = {
        id: meta.data[REQUEST_KEY_PROP] as string,
        source: meta.request,
        snapshot: undefined,
        status: REQUEST_STATUS.CREATED,
    };

    State.update(trailDataRequests.state, getPath(trailDataRequests, requestKey), item);
    return requestKey;
};

export const setStatus = (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus, requestKey: string): void => {
    try {
        // If no appropriate reference is found, do same as testing if it exists
        const exists = has(trailDataRequests, requestKey);
        if (exists) {
            State.set(trailDataRequests.state, utils.pathify(trailDataRequests.path, requestKey, 'status'), status);
        }
    } catch (error) {
        // silent
    }
};

export const getStatus = (trailDataRequests: FT.TrailDataRequestsInstance, requestKey: string): void => {
    return State.get(trailDataRequests.state, utils.pathify(trailDataRequests.path, requestKey, 'status'));
};

export default { create, count, get, getItems, getItemsList, set, setStatus, getStatus, getItemsListByStatus, filterByFlowStart };
