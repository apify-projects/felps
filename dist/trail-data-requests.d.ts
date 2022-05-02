import { ModelReference, RequestSource, TrailDataRequestItem, TrailDataRequestItemStatus, TrailDataRequestsInstance, TrailDataRequestsOptions } from './types';
export declare const create: (options: TrailDataRequestsOptions) => TrailDataRequestsInstance;
export declare const has: (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference) => boolean;
export declare const get: (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference) => TrailDataRequestItem;
export declare const getItems: (trailDataRequests: TrailDataRequestsInstance) => Record<string, TrailDataRequestItem>;
export declare const getItemsList: (trailDataRequests: TrailDataRequestsInstance, ref?: Partial<{} & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => TrailDataRequestItem[];
export declare const getItemsListByStatus: (trailDataRequests: TrailDataRequestsInstance, status: TrailDataRequestItemStatus | TrailDataRequestItemStatus[], ref?: Partial<{} & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => TrailDataRequestItem[];
export declare const count: (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference) => number;
export declare const getReference: (trailDataRequests: TrailDataRequestsInstance, ref: ModelReference) => ModelReference;
export declare const set: (trailDataRequests: TrailDataRequestsInstance, request: RequestSource, ref?: Partial<{} & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => ModelReference;
export declare const setStatus: (trailDataRequests: TrailDataRequestsInstance, status: TrailDataRequestItemStatus, ref: ModelReference) => void;
declare const _default: {
    create: (options: TrailDataRequestsOptions) => TrailDataRequestsInstance;
    count: (trailDataRequests: TrailDataRequestsInstance, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => number;
    get: (trailDataRequests: TrailDataRequestsInstance, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => TrailDataRequestItem;
    getItems: (trailDataRequests: TrailDataRequestsInstance) => Record<string, TrailDataRequestItem>;
    getItemsList: (trailDataRequests: TrailDataRequestsInstance, ref?: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined) => TrailDataRequestItem[];
    getReference: (trailDataRequests: TrailDataRequestsInstance, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>;
    set: (trailDataRequests: TrailDataRequestsInstance, request: RequestSource, ref?: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined) => Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>;
    setStatus: (trailDataRequests: TrailDataRequestsInstance, status: TrailDataRequestItemStatus, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => void;
    getItemsListByStatus: (trailDataRequests: TrailDataRequestsInstance, status: TrailDataRequestItemStatus | TrailDataRequestItemStatus[], ref?: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined) => TrailDataRequestItem[];
};
export default _default;
//# sourceMappingURL=trail-data-requests.d.ts.map