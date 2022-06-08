import { FlowDefinition, HooksInstance, InputDefinition, ModelDefinition, StepInstance } from '@usefelps/types';
export declare const create: <M extends Record<string, ModelDefinition<import("@usefelps/types").JSONSchema>>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition<{
    type: "object";
}>>(_: {
    MODELS?: M;
    FLOWS?: F;
    STEPS: S;
    INPUT: I;
}) => HooksInstance<M, F, S, I>;
export declare const globalHookNames: string[];
export declare const clone: <T extends Record<string, StepInstance<unknown>>>(hooks: T) => T;
declare const _default: {
    create: <M extends Record<string, ModelDefinition<import("@usefelps/types").JSONSchema>>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition<{
        type: "object";
    }>>(_: {
        MODELS?: M;
        FLOWS?: F;
        STEPS: S;
        INPUT: I;
    }) => HooksInstance<M, F, S, I>;
    globalHookNames: string[];
    clone: <T extends Record<string, StepInstance<unknown>>>(hooks: T) => T;
};
export default _default;
//# sourceMappingURL=index.d.ts.map