import { ModelInstance, RequestSource, TrailDataModelItem, TrailDataRequestItem, TrailDataStage, TrailDataStages, TrailFlowState, TrailInstance, TrailOptions, TrailState, UniqueyKey } from './types';
export declare const create: (options: TrailOptions) => TrailInstance;
export declare const load: (trail: TrailInstance) => Promise<TrailInstance>;
export declare const createFrom: (request: RequestSource, options: TrailOptions) => TrailInstance;
export declare const get: (trail: TrailInstance) => TrailState;
export declare const getFlow: (trail: TrailInstance, flowKey: UniqueyKey | undefined) => TrailFlowState | undefined;
export declare const setFlow: (trail: TrailInstance, flowState: TrailFlowState) => UniqueyKey;
export declare const setRequest: (trail: TrailInstance, request: any) => void;
export declare const stage: (trail: TrailInstance, type: TrailDataStages) => TrailDataStage;
export declare const ingested: (trail: TrailInstance) => TrailDataStage;
export declare const digested: (trail: TrailInstance) => TrailDataStage;
export declare const promote: (trail: TrailInstance, item: TrailDataModelItem | TrailDataRequestItem) => void;
export declare const resolve: <T = unknown>(trail: TrailInstance, model: ModelInstance) => T | undefined;
declare const _default: {
    create: (options: TrailOptions) => TrailInstance;
    createFrom: (request: RequestSource, options: TrailOptions) => TrailInstance;
    load: (trail: TrailInstance) => Promise<TrailInstance>;
    get: (trail: TrailInstance) => TrailState;
    setRequest: (trail: TrailInstance, request: any) => void;
    setFlow: (trail: TrailInstance, flowState: TrailFlowState) => string;
    getFlow: (trail: TrailInstance, flowKey: string | undefined) => TrailFlowState | undefined;
    ingested: (trail: TrailInstance) => TrailDataStage;
    digested: (trail: TrailInstance) => TrailDataStage;
    promote: (trail: TrailInstance, item: TrailDataModelItem<unknown> | TrailDataRequestItem) => void;
    resolve: <T = unknown>(trail: TrailInstance, model: ModelInstance<import("./types").JSONSchema>) => T | undefined;
};
export default _default;
//# sourceMappingURL=trail.d.ts.map