import { FlowDefinition, FlowInstance, FlowNamesObject, ModelDefinition } from '@usefelps/types';
export declare const create: <F extends Record<string, FlowDefinition<string>>>({ FLOWS }: {
    FLOWS: F;
}) => Record<keyof F, FlowInstance<string>>;
export declare const use: <S extends Record<string, Partial<Pick<import("@usefelps/types").StepInstance<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
    type: "object";
}>> & import("@usefelps/types").StepApiHelpersAPI>, "crawlerOptions">>>, M extends Record<string, ModelDefinition<import("@usefelps/types").JSONSchema>>>(_: {
    STEPS: S;
    MODELS?: M;
}) => {
    define: <T extends Record<string, FlowDefinition<keyof S>>>(flows: T) => T;
};
export declare const names: <F extends Record<string, FlowDefinition<string>>>(FLOWS: F) => FlowNamesObject<F>;
export declare const clone: <T>(flows: T) => T;
declare const _default: {
    create: <F extends Record<string, FlowDefinition<string>>>({ FLOWS }: {
        FLOWS: F;
    }) => Record<keyof F, FlowInstance<string>>;
    use: <S extends Record<string, Partial<Pick<import("@usefelps/types").StepInstance<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
        type: "object";
    }>> & import("@usefelps/types").StepApiHelpersAPI>, "crawlerOptions">>>, M extends Record<string, ModelDefinition<import("@usefelps/types").JSONSchema>>>(_: {
        STEPS: S;
        MODELS?: M;
    }) => {
        define: <T extends Record<string, FlowDefinition<keyof S>>>(flows: T) => T;
    };
    names: <F_1 extends Record<string, FlowDefinition<string>>>(FLOWS: F_1) => FlowNamesObject<F_1>;
    clone: <T_1>(flows: T_1) => T_1;
};
export default _default;
//# sourceMappingURL=index.d.ts.map