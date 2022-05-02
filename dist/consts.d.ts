import { TrailDataRequestItemStatus, TrailDataModelItemStatus } from './types';
export declare const UID_KEY_PREFIX = "uk";
export declare const UID_KEY_LENGTH = 2;
export declare const REQUEST_STATUS: Record<TrailDataRequestItemStatus, TrailDataRequestItemStatus>;
export declare const MODEL_STATUS: Record<TrailDataModelItemStatus, TrailDataModelItemStatus>;
export declare const REFERENCE_KEY: (modelName: string) => string;
export declare const MODEL_UID_KEY: (modelName: string) => string;
export declare const REQUEST_UID_KEY = "req";
export declare const METADATA_KEY = "___felps";
export declare const SCHEMA_MODEL_NAME_KEY = "modelName";
export declare const REQUEST_KEY_PROP: "fRequestKey";
export declare const TRAIL_KEY_PROP: "fTrailKey";
export declare const FLOW_KEY_PROP: "fFlowKey";
//# sourceMappingURL=consts.d.ts.map