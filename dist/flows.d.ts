import { FlowDefinition, FlowDefinitions, FlowNamesObject, ModelDefinition } from './types';
export declare const create: <F extends Record<string, FlowDefinition<string>>>({ FLOWS }: {
    FLOWS: F;
}) => F;
export declare const use: <S extends Record<string, Partial<Pick<import("./types").StepInstance<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
    type: "object";
}>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>, M extends Record<string, ModelDefinition<import("./types").JSONSchema>>>(_: {
    STEPS: S;
    MODELS?: M | undefined;
}) => {
    define: <T extends Record<string, FlowDefinition<keyof S>>>(flows: T) => FlowDefinitions<keyof S, T>;
};
export declare const names: <F extends Record<string, FlowDefinition<string>>>(FLOWS: F) => FlowNamesObject<F>;
declare const _default: {
    create: <F extends Record<string, FlowDefinition<string>>>({ FLOWS }: {
        FLOWS: F;
    }) => F;
    use: <S extends Record<string, Partial<Pick<import("./types").StepInstance<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
        type: "object";
    }>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>, M extends Record<string, ModelDefinition<import("./types").JSONSchema>>>(_: {
        STEPS: S;
        MODELS?: M | undefined;
    }) => {
        define: <T extends Record<string, FlowDefinition<keyof S>>>(flows: T) => FlowDefinitions<keyof S, T>;
    };
    names: <F_1 extends Record<string, FlowDefinition<string>>>(FLOWS: F_1) => FlowNamesObject<F_1>;
};
export default _default;
//# sourceMappingURL=flows.d.ts.map