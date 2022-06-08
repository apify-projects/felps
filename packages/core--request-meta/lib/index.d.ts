import * as FT from '@usefelps/types';
export declare const create: (requestOrRequestContext?: FT.RequestSource | FT.RequestContext | FT.RequestContext) => FT.RequestMetaInstance;
export declare const contextDefaulted: (context?: FT.RequestContext) => FT.RequestContext;
export declare const extend: (requestMeta: FT.RequestMetaInstance, ...metadata: Partial<FT.RequestMetaData>[]) => FT.RequestMetaInstance;
export declare const cloneContext: (context: FT.RequestContext) => FT.RequestContext;
declare const _default: {
    create: (requestOrRequestContext?: FT.RequestSource | FT.RequestContext) => FT.RequestMetaInstance;
    extend: (requestMeta: FT.RequestMetaInstance, ...metadata: Partial<FT.RequestMetaData>[]) => FT.RequestMetaInstance;
    contextDefaulted: (context?: FT.RequestContext) => FT.RequestContext;
    cloneContext: (context: FT.RequestContext) => FT.RequestContext;
};
export default _default;
//# sourceMappingURL=index.d.ts.map