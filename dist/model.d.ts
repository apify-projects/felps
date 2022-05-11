import { GeneralStepApi, JSONSchema, JSONSchemaWithMethods, ModelDefinition, ModelInstance, ModelOptions, ModelReference, ReallyAny, ReferenceKey, TrailDataModelItem, ValidatorValidateOptions } from './types';
export declare const create: (options: ModelOptions) => ModelInstance<JSONSchema>;
export declare const define: <T extends ModelDefinition<JSONSchemaWithMethods>>(model: T) => T;
export declare const walk: (model: ModelInstance, walker: (key: string, value: ReallyAny) => void) => void;
export declare const flatten: (model: ModelInstance) => ModelInstance[];
export declare const dependencies: (model: ModelInstance) => ModelInstance[];
export declare const referenceKeys: (model: ModelInstance) => ReferenceKey[];
export declare const referenceKeysSchema: (model: ModelInstance) => JSONSchema;
export declare const referenceValue: (model: ModelInstance, ref: ModelReference) => string;
export declare const referenceFor: (model: ModelInstance, ref: ModelReference, withOwnReferenceKey?: boolean | undefined) => ModelReference;
export declare const validate: <T = unknown>(model: ModelInstance<JSONSchema>, data: T, options?: ValidatorValidateOptions) => {
    valid: boolean;
    errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
};
export declare const validateReference: <T = unknown>(model: ModelInstance, ref: Partial<{ [K in Extract<keyof T, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
    fActorKey: string;
}>, options?: ValidatorValidateOptions) => {
    valid: boolean;
    errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
};
export declare const find: (model: ModelInstance, items: TrailDataModelItem<ReallyAny>[], newItem: TrailDataModelItem<ReallyAny>) => TrailDataModelItem<ReallyAny> | undefined;
export declare const connect: ({ api }: {
    api: GeneralStepApi;
}) => {
    organizeList(model: ModelInstance, items: TrailDataModelItem[]): Promise<{
        valid: TrailDataModelItem[];
        invalid: TrailDataModelItem[];
    }>;
    isListComplete(model: ModelInstance, items: TrailDataModelItem[]): Promise<boolean>;
};
export declare const schemaAsRaw: <T>(schema: T) => T;
declare const _default: {
    create: (options: ModelOptions<JSONSchema>) => ModelInstance<JSONSchema>;
    define: <T extends ModelDefinition<JSONSchemaWithMethods>>(model: T) => T;
    dependencies: (model: ModelInstance<JSONSchema>) => ModelInstance<JSONSchema>[];
    referenceKeys: (model: ModelInstance<JSONSchema>) => string[];
    referenceFor: (model: ModelInstance<JSONSchema>, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>, withOwnReferenceKey?: boolean | undefined) => Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>;
    referenceValue: (model: ModelInstance<JSONSchema>, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => string;
    find: (model: ModelInstance<JSONSchema>, items: TrailDataModelItem<any>[], newItem: TrailDataModelItem<any>) => TrailDataModelItem<any> | undefined;
    validate: <T_1 = unknown>(model: ModelInstance<JSONSchema>, data: T_1, options?: ValidatorValidateOptions) => {
        valid: boolean;
        errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
    };
    validateReference: <T_2 = unknown>(model: ModelInstance<JSONSchema>, ref: Partial<{ [K in Extract<keyof T_2, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>, options?: ValidatorValidateOptions) => {
        valid: boolean;
        errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
    };
    connect: ({ api }: {
        api: GeneralStepApi<import("./types").InputDefinition<{
            type: "object";
        }>>;
    }) => {
        organizeList(model: ModelInstance<JSONSchema>, items: TrailDataModelItem<unknown>[]): Promise<{
            valid: TrailDataModelItem<unknown>[];
            invalid: TrailDataModelItem<unknown>[];
        }>;
        isListComplete(model: ModelInstance<JSONSchema>, items: TrailDataModelItem<unknown>[]): Promise<boolean>;
    };
    walk: (model: ModelInstance<JSONSchema>, walker: (key: string, value: any) => void) => void;
    flatten: (model: ModelInstance<JSONSchema>) => ModelInstance<JSONSchema>[];
    schemaAsRaw: <T_3>(schema: T_3) => T_3;
};
export default _default;
//# sourceMappingURL=model.d.ts.map