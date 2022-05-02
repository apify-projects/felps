import { RequestContext, RequestMetaData, RequestMetaInstance, RequestSource } from './types';
export declare const create: (requestOrRequestContext?: RequestSource | RequestContext | undefined) => RequestMetaInstance;
export declare const contextDefaulted: (context?: RequestContext | undefined) => RequestContext;
export declare const extend: (requestMeta: RequestMetaInstance, ...metadata: Partial<RequestMetaData>[]) => RequestMetaInstance;
declare const _default: {
    create: (requestOrRequestContext?: RequestSource | RequestContext | undefined) => RequestMetaInstance;
    extend: (requestMeta: RequestMetaInstance, ...metadata: Partial<RequestMetaData>[]) => RequestMetaInstance;
    contextDefaulted: (context?: RequestContext | undefined) => RequestContext;
};
export default _default;
//# sourceMappingURL=request-meta.d.ts.map