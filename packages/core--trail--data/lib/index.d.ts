import { ModelReference, ReallyAny, TrailDataInstance } from '@usefelps/types';
export declare const defaultUpdateMerger: (existingValue: ReallyAny, newValue: ReallyAny) => any;
export declare const getPath: <T = unknown>(trailData: TrailDataInstance, ref: Partial<{ [K in Extract<keyof T, string> as `${import("@usefelps/types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
    fActorKey: string;
}>, ...segments: string[]) => string;
declare const _default: {
    getPath: <T = unknown>(trailData: TrailDataInstance, ref: Partial<{ [K in Extract<keyof T, string> as `${import("@usefelps/types").SnakeToCamelCase<K>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>, ...segments: string[]) => string;
    defaultUpdateMerger: (existingValue: any, newValue: any) => any;
};
export default _default;
//# sourceMappingURL=index.d.ts.map