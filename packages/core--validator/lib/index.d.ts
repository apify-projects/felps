import { ReallyAny, ValidatorInstance, ValidatorOptions, ValidatorValidateOptions } from '@usefelps/types';
export declare const create: (options?: ValidatorOptions) => {
    schema: import("@usefelps/types").JSONSchema;
    uid?: string;
    key?: string;
    name: string;
    id: string;
};
export declare const validate: (validator: ValidatorInstance, data?: ReallyAny, options?: ValidatorValidateOptions) => {
    valid: boolean;
    errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
};
declare const _default: {
    create: (options?: ValidatorOptions) => {
        schema: import("@usefelps/types").JSONSchema;
        uid?: string;
        key?: string;
        name: string;
        id: string;
    };
    validate: (validator: ValidatorInstance, data?: any, options?: ValidatorValidateOptions) => {
        valid: boolean;
        errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map