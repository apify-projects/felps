import { JSONSchemaWithMethods, ModelDefinition, ModelDefinitions } from './types';
export declare const create: <M extends Record<string, ModelDefinition<import("./types").JSONSchema>>>({ MODELS }: {
    MODELS: M;
}) => M;
export declare const define: <T extends Record<string, ModelDefinition<JSONSchemaWithMethods>>>(models: T) => T;
declare const _default: {
    create: <M extends Record<string, ModelDefinition<import("./types").JSONSchema>>>({ MODELS }: {
        MODELS: M;
    }) => M;
    define: <T extends Record<string, ModelDefinition<JSONSchemaWithMethods>>>(models: T) => T;
};
export default _default;
//# sourceMappingURL=models.d.ts.map