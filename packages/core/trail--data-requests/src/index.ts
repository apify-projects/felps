/* eslint-disable max-len */
import { REQUEST_ID_PROP, REQUEST_STATUS, REQUEST_UID_KEY } from '@usefelps/constants';
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

export const getPath = (trailDataRequests: FT.TrailDataRequestsInstance, requestId: string, ...segments: string[]): string => {
    return utils.pathify(trailDataRequests.path, requestId, ...segments);
}

export const has = (trailDataRequests: FT.TrailDataRequestsInstance, requestId: string): boolean => {
    return State.has(trailDataRequests.state, getPath(trailDataRequests, requestId));
};

export const get = (trailDataRequests: FT.TrailDataRequestsInstance, requestId: string): FT.TrailDataRequestItem => {
    return State.get<FT.TrailDataRequestItem>(trailDataRequests.state, getPath(trailDataRequests, requestId));
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

export const set = (trailDataRequests: FT.TrailDataRequestsInstance, request: FT.RequestSource, requestId: string = utils.craftUIDKey(REQUEST_UID_KEY)): string => {
    const meta = RequestMeta.extend(RequestMeta.create(request), { [REQUEST_ID_PROP]: requestId });

    const item: FT.TrailDataRequestItem = {
        id: meta.data[REQUEST_ID_PROP] as string,
        source: meta.request,
        snapshot: undefined,
        status: REQUEST_STATUS.CREATED,
    };

    State.update(trailDataRequests.state, getPath(trailDataRequests, requestId), item);
    return requestId;
};

export const setStatus = (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus, requestId: string): void => {
    try {
        // If no appropriate reference is found, do same as testing if it exists
        const exists = has(trailDataRequests, requestId);
        if (exists) {
            State.set(trailDataRequests.state, utils.pathify(trailDataRequests.path, requestId, 'status'), status);
        }
    } catch (error) {
        // silent
    }
};

export const getStatus = (trailDataRequests: FT.TrailDataRequestsInstance, requestId: string): void => {
    return State.get(trailDataRequests.state, utils.pathify(trailDataRequests.path, requestId, 'status'));
};

export default { create, count, get, getItems, getItemsList, set, setStatus, getStatus, getItemsListByStatus, filterByFlowStart };
