import { ModelReference, TrailDataModelInstance, TrailDataModelItem, TrailDataModelOperation, TrailDataModelItemStatus, TrailDataModelOptions, ReallyAny } from './types';
export declare const create: (options: TrailDataModelOptions) => TrailDataModelInstance;
export declare const get: <T = unknown>(trailDataModel: TrailDataModelInstance, ref: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>) => TrailDataModelItem<T>;
export declare const getItemsList: <T = unknown>(trailDataModel: TrailDataModelInstance, ref?: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => TrailDataModelItem[];
export declare const getItems: <T = unknown>(trailDataModel: TrailDataModelInstance, ref?: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => Record<string, TrailDataModelItem>;
export declare const getItemsListByStatus: (trailDataModel: TrailDataModelInstance, status: TrailDataModelItemStatus | TrailDataModelItemStatus[], ref?: Partial<{} & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => TrailDataModelItem[];
export declare const filterByStatus: (...statuses: TrailDataModelItemStatus[]) => (value: ReallyAny) => boolean;
export declare const filterByPartial: (partial?: boolean | undefined) => (value: ReallyAny) => boolean;
export declare const groupByParentHash: (trailDataModel: TrailDataModelInstance, items: TrailDataModelItem[]) => Map<string, TrailDataModelItem<unknown>[]>;
export declare const getChildrenItemsList: <T = unknown>(trailDataModel: TrailDataModelInstance, parentRef: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>) => TrailDataModelItem[];
export declare const boostrapItem: <T = unknown>(trailDataModel: TrailDataModelInstance, data: T, ref?: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => Partial<TrailDataModelItem<T>>;
export declare const getExistingReference: <T = unknown>(trailDataModel: TrailDataModelInstance, data: T) => Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined;
export declare const getReference: <T = unknown>(trailDataModel: TrailDataModelInstance, data: T, ref?: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>;
export declare const playOperation: <T = unknown>(trailDataModel: TrailDataModelInstance, op: TrailDataModelOperation['op'], data: T | Partial<T>, ref?: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>;
export declare const set: <T = unknown>(trailDataModel: TrailDataModelInstance, data: T, ref?: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}> | undefined) => Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>;
export declare const setPartial: <T = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T>, ref: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>) => Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>;
export declare const update: <T = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T>, ref: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>) => Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>;
export declare const updatePartial: <T = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T>, ref: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>) => Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>;
export declare const setStatus: (trailDataModel: TrailDataModelInstance, status: TrailDataModelItemStatus, ref: ModelReference) => void;
export declare const count: <T>(trailDataModel: TrailDataModelInstance, ref: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
}>) => number;
declare const _default: {
    create: (options: TrailDataModelOptions) => TrailDataModelInstance;
    get: <T = unknown>(trailDataModel: TrailDataModelInstance, ref: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => TrailDataModelItem<T>;
    getItems: <T_1 = unknown>(trailDataModel: TrailDataModelInstance, ref?: Partial<{ [K_1 in Extract<keyof T_1, string> as `${import("./types").SnakeToCamelCase<K_1>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined) => Record<string, TrailDataModelItem<unknown>>;
    getItemsList: <T_2 = unknown>(trailDataModel: TrailDataModelInstance, ref?: Partial<{ [K_2 in Extract<keyof T_2, string> as `${import("./types").SnakeToCamelCase<K_2>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined) => TrailDataModelItem<unknown>[];
    getItemsListByStatus: (trailDataModel: TrailDataModelInstance, status: TrailDataModelItemStatus | TrailDataModelItemStatus[], ref?: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined) => TrailDataModelItem<unknown>[];
    getChildrenItemsList: <T_3 = unknown>(trailDataModel: TrailDataModelInstance, parentRef: Partial<{ [K_3 in Extract<keyof T_3, string> as `${import("./types").SnakeToCamelCase<K_3>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => TrailDataModelItem<unknown>[];
    update: <T_4 = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T_4>, ref: Partial<{ [K_4 in Extract<keyof T_4, string> as `${import("./types").SnakeToCamelCase<K_4>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => Partial<{ [K_4 in Extract<keyof T_4, string> as `${import("./types").SnakeToCamelCase<K_4>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>;
    updatePartial: <T_5 = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T_5>, ref: Partial<{ [K_5 in Extract<keyof T_5, string> as `${import("./types").SnakeToCamelCase<K_5>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => Partial<{ [K_5 in Extract<keyof T_5, string> as `${import("./types").SnakeToCamelCase<K_5>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>;
    set: <T_6 = unknown>(trailDataModel: TrailDataModelInstance, data: T_6, ref?: Partial<{ [K_6 in Extract<keyof T_6, string> as `${import("./types").SnakeToCamelCase<K_6>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined) => Partial<{ [K_6 in Extract<keyof T_6, string> as `${import("./types").SnakeToCamelCase<K_6>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>;
    setStatus: (trailDataModel: TrailDataModelInstance, status: TrailDataModelItemStatus, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => void;
    count: <T_7>(trailDataModel: TrailDataModelInstance, ref: Partial<{ [K_7 in Extract<keyof T_7, string> as `${import("./types").SnakeToCamelCase<K_7>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => number;
    setPartial: <T_8 = unknown>(trailDataModel: TrailDataModelInstance, data: Partial<T_8>, ref: Partial<{ [K_8 in Extract<keyof T_8, string> as `${import("./types").SnakeToCamelCase<K_8>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>) => Partial<{ [K_8 in Extract<keyof T_8, string> as `${import("./types").SnakeToCamelCase<K_8>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }>;
    boostrapItem: <T_9 = unknown>(trailDataModel: TrailDataModelInstance, data: T_9, ref?: Partial<{ [K_9 in Extract<keyof T_9, string> as `${import("./types").SnakeToCamelCase<K_9>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined) => Partial<TrailDataModelItem<T_9>>;
    filterByStatus: (...statuses: TrailDataModelItemStatus[]) => (value: any) => boolean;
    filterByPartial: (partial?: boolean | undefined) => (value: any) => boolean;
    groupByParentHash: (trailDataModel: TrailDataModelInstance, items: TrailDataModelItem<unknown>[]) => Map<string, TrailDataModelItem<unknown>[]>;
    getExistingReference: <T_10 = unknown>(trailDataModel: TrailDataModelInstance, data: T_10) => Partial<{ [K_10 in Extract<keyof T_10, string> as `${import("./types").SnakeToCamelCase<K_10>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
    }> | undefined;
};
export default _default;
//# sourceMappingURL=trail-data-model.d.ts.map