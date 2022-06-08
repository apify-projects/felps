import * as FT from '@usefelps/types';
export declare const create: <M extends Record<string, FT.ModelDefinition<FT.JSONSchema>>>({ MODELS }: {
    MODELS: M;
}) => M;
export declare const define: <T extends Record<string, FT.ModelDefinition<FT.JSONSchemaWithMethods>>>(models: T) => T;
export declare const clone: <T>(models: T) => T;
declare const _default: {
    create: <M extends Record<string, FT.ModelDefinition<FT.JSONSchema>>>({ MODELS }: {
        MODELS: M;
    }) => M;
    define: <T extends Record<string, FT.ModelDefinition<FT.JSONSchemaWithMethods>>>(models: T) => T;
    clone: <T_1>(models: T_1) => T_1;
};
export default _default;
//# sourceMappingURL=index.d.ts.map