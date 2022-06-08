import * as FT from '@usefelps/types';
export declare const create: (options: FT.TrailDataRequestsOptions) => FT.TrailDataRequestsInstance;
export declare const has: (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference) => boolean;
export declare const get: (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference) => FT.TrailDataRequestItem;
export declare const getItems: (trailDataRequests: FT.TrailDataRequestsInstance) => Record<string, FT.TrailDataRequestItem>;
export declare const getItemsList: (trailDataRequests: FT.TrailDataRequestsInstance, ref?: FT.ModelReference) => FT.TrailDataRequestItem[];
export declare const getItemsListByStatus: (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus | FT.TrailDataRequestItemStatus[], ref?: FT.ModelReference) => FT.TrailDataRequestItem[];
export declare const filterByFlowStart: (item: FT.TrailDataRequestItem) => boolean;
export declare const count: (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference) => number;
export declare const getReference: (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference) => FT.ModelReference;
export declare const set: (trailDataRequests: FT.TrailDataRequestsInstance, request: FT.RequestSource, ref?: FT.ModelReference) => FT.ModelReference;
export declare const setStatus: (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus, ref: FT.ModelReference) => void;
export declare const getStatus: (trailDataRequests: FT.TrailDataRequestsInstance, ref: FT.ModelReference) => void;
declare const _default: {
    create: (options: FT.TrailDataRequestsOptions) => FT.TrailDataRequestsInstance;
    count: (trailDataRequests: FT.TrailDataRequestsInstance, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => number;
    get: (trailDataRequests: FT.TrailDataRequestsInstance, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => FT.TrailDataRequestItem;
    getItems: (trailDataRequests: FT.TrailDataRequestsInstance) => Record<string, FT.TrailDataRequestItem>;
    getItemsList: (trailDataRequests: FT.TrailDataRequestsInstance, ref?: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => FT.TrailDataRequestItem[];
    getReference: (trailDataRequests: FT.TrailDataRequestsInstance, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>;
    set: (trailDataRequests: FT.TrailDataRequestsInstance, request: FT.RequestSource, ref?: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>;
    setStatus: (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => void;
    getStatus: (trailDataRequests: FT.TrailDataRequestsInstance, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => void;
    getItemsListByStatus: (trailDataRequests: FT.TrailDataRequestsInstance, status: FT.TrailDataRequestItemStatus | FT.TrailDataRequestItemStatus[], ref?: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => FT.TrailDataRequestItem[];
    filterByFlowStart: (item: FT.TrailDataRequestItem) => boolean;
};
export default _default;
//# sourceMappingURL=index.d.ts.map