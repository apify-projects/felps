import * as FT from '@usefelps/types';
export declare const create: <M extends Record<string, FT.ModelDefinition<FT.JSONSchema>>, F extends Record<string, FT.FlowDefinition<keyof StepDefinitions>>, StepDefinitions extends Record<string, Partial<Pick<FT.StepInstance<FT.StepApiMetaAPI<FT.InputDefinition<{
    type: "object";
}>> & FT.StepApiHelpersAPI>, "crawlerOptions">>>, I extends FT.InputDefinition<{
    type: "object";
}>>({ STEPS }: {
    MODELS?: M;
    FLOWS?: F;
    STEPS: StepDefinitions;
    INPUT: I;
}) => FT.StepCollectionInstance<M, F, StepDefinitions, I>;
export declare const define: <T extends Record<string, Partial<Pick<FT.StepInstance<FT.StepApiMetaAPI<FT.InputDefinition<{
    type: "object";
}>> & FT.StepApiHelpersAPI>, "crawlerOptions">>>>(steps: T) => FT.StepDefinitions<T>;
export declare const clone: <T>(hooks: T) => T;
declare const _default: {
    create: <M extends Record<string, FT.ModelDefinition<FT.JSONSchema>>, F extends Record<string, FT.FlowDefinition<keyof StepDefinitions>>, StepDefinitions extends Record<string, Partial<Pick<FT.StepInstance<FT.StepApiMetaAPI<FT.InputDefinition<{
        type: "object";
    }>> & FT.StepApiHelpersAPI>, "crawlerOptions">>>, I extends FT.InputDefinition<{
        type: "object";
    }>>({ STEPS }: {
        MODELS?: M;
        FLOWS?: F;
        STEPS: StepDefinitions;
        INPUT: I;
    }) => FT.StepCollectionInstance<M, F, StepDefinitions, I>;
    define: <T extends Record<string, Partial<Pick<FT.StepInstance<FT.StepApiMetaAPI<FT.InputDefinition<{
        type: "object";
    }>> & FT.StepApiHelpersAPI>, "crawlerOptions">>>>(steps: T) => FT.StepDefinitions<T>;
    clone: <T_1>(hooks: T_1) => T_1;
};
export default _default;
//# sourceMappingURL=index.d.ts.map