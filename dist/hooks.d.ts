import type { FlowDefinition, HooksInstance, InputDefinition, ModelDefinition, StepInstance } from './types';
export declare const create: <M extends Record<string, ModelDefinition<import("./types").JSONSchema>>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition<{
    type: "object";
}>>(_: {
    MODELS?: M | undefined;
    FLOWS?: F | undefined;
    STEPS: S;
    INPUT: I;
}) => HooksInstance<M, F, S, I>;
export declare const globalHookNames: string[];
export declare const clone: <T extends Record<string, StepInstance<unknown>>>(hooks: T) => T;
declare const _default: {
    create: <M extends Record<string, ModelDefinition<import("./types").JSONSchema>>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition<{
        type: "object";
    }>>(_: {
        MODELS?: M | undefined;
        FLOWS?: F | undefined;
        STEPS: S;
        INPUT: I;
    }) => HooksInstance<M, F, S, I>;
    globalHookNames: string[];
    clone: <T extends Record<string, StepInstance<unknown>>>(hooks: T) => T;
};
export default _default;
//# sourceMappingURL=hooks.d.ts.map