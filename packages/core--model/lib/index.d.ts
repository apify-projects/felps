import * as FT from '@usefelps/types';
export declare const create: (options: FT.ModelOptions) => FT.ModelInstance<FT.JSONSchema>;
export declare const define: <T extends FT.ModelDefinition<FT.JSONSchemaWithMethods>>(model: T) => T;
export declare const walk: (model: FT.ModelInstance, walker: (key: string, value: FT.ReallyAny) => void) => void;
export declare const flatten: (model: FT.ModelInstance) => FT.ModelInstance[];
export declare const dependency: (model: FT.ModelInstance, modelName: string) => FT.ModelInstance | undefined;
export declare const dependencies: (model: FT.ModelInstance) => FT.ModelInstance[];
export declare const referenceKeys: (model: FT.ModelInstance) => FT.ReferenceKey[];
export declare const referenceKeysSchema: (model: FT.ModelInstance) => FT.JSONSchema;
export declare const referenceValue: (model: FT.ModelInstance, ref: FT.ModelReference) => string;
export declare const referenceFor: (model: FT.ModelInstance, ref: FT.ModelReference, options?: {
    withOwnReferenceKey?: boolean;
    includeNotFound?: boolean;
}) => FT.ModelReference;
export declare const validate: <T = unknown>(model: FT.ModelInstance<FT.JSONSchema>, data: T, options?: FT.ValidatorValidateOptions) => {
    valid: boolean;
    errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
};
export declare const validateReference: <T = unknown>(model: FT.ModelInstance, ref: Partial<{ [K in Extract<keyof T, string> as `${FT.SnakeToCamelCase<K>}Key`]: string; } & {
    fRequestKey: string;
    fTrailKey: string;
    fFlowKey: string;
    fActorKey: string;
}>, options?: FT.ValidatorValidateOptions) => {
    valid: boolean;
    errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
};
export declare const find: (model: FT.ModelInstance, items: FT.TrailDataModelItem<FT.ReallyAny>[], newItem: FT.TrailDataModelItem<FT.ReallyAny>) => FT.TrailDataModelItem<FT.ReallyAny> | undefined;
export declare const connect: ({ api }: {
    api: FT.GeneralStepApi;
}) => {
    organizeList(model: FT.ModelInstance, items: FT.TrailDataModelItem<FT.ReallyAny>[]): Promise<{
        valid: FT.TrailDataModelItem[];
        invalid: FT.TrailDataModelItem[];
    }>;
    isListComplete(model: FT.ModelInstance, items: FT.TrailDataModelItem[]): Promise<boolean>;
};
export declare const schemaAsRaw: <T>(schema: T) => T;
export declare const schemaWithoutRequired: <T extends FT.JSONSchema>(schema: T) => T;
declare const _default: {
    create: (options: FT.ModelOptions<FT.JSONSchema>) => FT.ModelInstance<FT.JSONSchema>;
    define: <T extends FT.ModelDefinition<FT.JSONSchemaWithMethods>>(model: T) => T;
    dependency: (model: FT.ModelInstance<FT.JSONSchema>, modelName: string) => FT.ModelInstance<FT.JSONSchema>;
    dependencies: (model: FT.ModelInstance<FT.JSONSchema>) => FT.ModelInstance<FT.JSONSchema>[];
    referenceKeys: (model: FT.ModelInstance<FT.JSONSchema>) => string[];
    referenceFor: (model: FT.ModelInstance<FT.JSONSchema>, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>, options?: {
        withOwnReferenceKey?: boolean;
        includeNotFound?: boolean;
    }) => Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>;
    referenceValue: (model: FT.ModelInstance<FT.JSONSchema>, ref: Partial<{} & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>) => string;
    find: (model: FT.ModelInstance<FT.JSONSchema>, items: FT.TrailDataModelItem<any>[], newItem: FT.TrailDataModelItem<any>) => FT.TrailDataModelItem<any>;
    validate: <T_1 = unknown>(model: FT.ModelInstance<FT.JSONSchema>, data: T_1, options?: FT.ValidatorValidateOptions) => {
        valid: boolean;
        errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
    };
    validateReference: <T_2 = unknown>(model: FT.ModelInstance<FT.JSONSchema>, ref: Partial<{ [K in Extract<keyof T_2, string> as `${FT.SnakeToCamelCase<K>}Key`]: string; } & {
        fRequestKey: string;
        fTrailKey: string;
        fFlowKey: string;
        fActorKey: string;
    }>, options?: FT.ValidatorValidateOptions) => {
        valid: boolean;
        errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
    };
    connect: ({ api }: {
        api: FT.GeneralStepApi<FT.InputDefinition<{
            type: "object";
        }>>;
    }) => {
        organizeList(model: FT.ModelInstance<FT.JSONSchema>, items: FT.TrailDataModelItem<any>[]): Promise<{
            valid: FT.TrailDataModelItem<unknown>[];
            invalid: FT.TrailDataModelItem<unknown>[];
        }>;
        isListComplete(model: FT.ModelInstance<FT.JSONSchema>, items: FT.TrailDataModelItem<unknown>[]): Promise<boolean>;
    };
    walk: (model: FT.ModelInstance<FT.JSONSchema>, walker: (key: string, value: any) => void) => void;
    flatten: (model: FT.ModelInstance<FT.JSONSchema>) => FT.ModelInstance<FT.JSONSchema>[];
    schemaAsRaw: <T_3>(schema: T_3) => T_3;
    schemaWithoutRequired: <T_4 extends FT.JSONSchema>(schema: T_4) => T_4;
};
export default _default;
//# sourceMappingURL=index.d.ts.map