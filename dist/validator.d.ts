import { ReallyAny, ValidatorInstance, ValidatorOptions, ValidatorValidateOptions } from './types';
export declare const create: (options?: ValidatorOptions | undefined) => {
    schema: import("./types").JSONSchema;
    uid?: string | undefined;
    key?: string | undefined;
    name: string;
    id: string;
};
export declare const validate: (validator: ValidatorInstance, data?: ReallyAny, options?: ValidatorValidateOptions) => {
    valid: boolean;
    errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
};
declare const _default: {
    create: (options?: ValidatorOptions | undefined) => {
        schema: import("./types").JSONSchema;
        uid?: string | undefined;
        key?: string | undefined;
        name: string;
        id: string;
    };
    validate: (validator: ValidatorInstance, data?: any, options?: ValidatorValidateOptions) => {
        valid: boolean;
        errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
    };
};
export default _default;
//# sourceMappingURL=validator.d.ts.map