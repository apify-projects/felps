import * as FT from '@usefelps/types';
export declare const create: (options: FT.TrailOptions) => FT.TrailInstance;
export declare const load: (trail: FT.TrailInstance) => Promise<FT.TrailInstance>;
export declare const createFrom: (request: FT.RequestSource, options: FT.TrailOptions) => FT.TrailInstance;
export declare const get: (trail: FT.TrailInstance) => FT.TrailState;
export declare const getMainFlow: (trail: FT.TrailInstance) => FT.TrailFlowState | undefined;
export declare const getFlow: (trail: FT.TrailInstance, flowKey: FT.UniqueyKey | undefined) => FT.TrailFlowState | undefined;
export declare const setFlow: (trail: FT.TrailInstance, flowState: FT.TrailFlowState) => FT.UniqueyKey;
export declare const setRequest: (trail: FT.TrailInstance, request: any) => void;
export declare const stage: (trail: FT.TrailInstance, type: FT.TrailDataStages) => FT.TrailDataStage;
export declare const modelOfStage: (trailStage: FT.TrailDataStage, modelName: string) => FT.TrailDataModelInstance;
export declare const ingested: (trail: FT.TrailInstance) => FT.TrailDataStage;
export declare const digested: (trail: FT.TrailInstance) => FT.TrailDataStage;
export declare const promote: (trail: FT.TrailInstance, item: FT.TrailDataModelItem | FT.TrailDataRequestItem) => void;
export declare const getEntities: (trail: FT.TrailInstance, modelName: string, ref?: FT.ModelReference) => FT.TrailDataModelItem[];
export declare const resolve: <T = unknown>(trail: FT.TrailInstance, model: FT.ModelInstance) => T;
declare const _default: {
    create: (options: FT.TrailOptions) => FT.TrailInstance;
    createFrom: (request: FT.RequestSource, options: FT.TrailOptions) => FT.TrailInstance;
    load: (trail: FT.TrailInstance) => Promise<FT.TrailInstance>;
    get: (trail: FT.TrailInstance) => FT.TrailState;
    setRequest: (trail: FT.TrailInstance, request: any) => void;
    getMainFlow: (trail: FT.TrailInstance) => FT.TrailFlowState;
    setFlow: (trail: FT.TrailInstance, flowState: FT.TrailFlowState) => string;
    getFlow: (trail: FT.TrailInstance, flowKey: string) => FT.TrailFlowState;
    ingested: (trail: FT.TrailInstance) => FT.TrailDataStage;
    digested: (trail: FT.TrailInstance) => FT.TrailDataStage;
    modelOfStage: (trailStage: FT.TrailDataStage, modelName: string) => FT.TrailDataModelInstance;
    promote: (trail: FT.TrailInstance, item: FT.TrailDataModelItem<unknown> | FT.TrailDataRequestItem) => void;
    resolve: <T = unknown>(trail: FT.TrailInstance, model: FT.ModelInstance<FT.JSONSchema>) => T;
    getEntities: (trail: FT.TrailInstance, modelName: string, ref?: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => FT.TrailDataModelItem<unknown>[];
};
export default _default;
//# sourceMappingURL=index.d.ts.map