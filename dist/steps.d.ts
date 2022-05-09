import { FlowDefinition, InputDefinition, ModelDefinition, StepDefinitions, StepInstance, StepsInstance } from './types';
export declare const create: <M extends Record<string, ModelDefinition<import("./types").JSONSchema>>, F extends Record<string, FlowDefinition<keyof StepDefinitions_1>>, StepDefinitions_1 extends Record<string, Partial<Pick<StepInstance<import("./types").StepApiMetaAPI<InputDefinition<{
    type: "object";
}>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>, I extends InputDefinition<{
    type: "object";
}>>({ STEPS }: {
    MODELS?: M | undefined;
    FLOWS?: F | undefined;
    STEPS: StepDefinitions_1;
    INPUT: I;
}) => StepsInstance<M, F, StepDefinitions_1, I>;
export declare const define: <T extends Record<string, Partial<Pick<StepInstance<import("./types").StepApiMetaAPI<InputDefinition<{
    type: "object";
}>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>>(steps: T) => StepDefinitions<T>;
export declare const clone: <T>(hooks: T) => T;
declare const _default: {
    create: <M extends Record<string, ModelDefinition<import("./types").JSONSchema>>, F extends Record<string, FlowDefinition<keyof StepDefinitions_1>>, StepDefinitions_1 extends Record<string, Partial<Pick<StepInstance<import("./types").StepApiMetaAPI<InputDefinition<{
        type: "object";
    }>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>, I extends InputDefinition<{
        type: "object";
    }>>({ STEPS }: {
        MODELS?: M | undefined;
        FLOWS?: F | undefined;
        STEPS: StepDefinitions_1;
        INPUT: I;
    }) => StepsInstance<M, F, StepDefinitions_1, I>;
    define: <T extends Record<string, Partial<Pick<StepInstance<import("./types").StepApiMetaAPI<InputDefinition<{
        type: "object";
    }>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>>(steps: T) => StepDefinitions<T>;
    clone: <T_1>(hooks: T_1) => T_1;
};
export default _default;
//# sourceMappingURL=steps.d.ts.map