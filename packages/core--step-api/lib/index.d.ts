import { ActorInstance, FlowDefinition, InputDefinition, ModelDefinition, RequestContext, StepApiInstance } from '@usefelps/types';
export declare const create: <F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition<import("@usefelps/types").JSONSchema>>, I extends InputDefinition<{
    type: "object";
}>>(actor: ActorInstance) => (context: RequestContext) => StepApiInstance<F, S, M, I, "NO_STEPNAME">;
declare const _default: {
    create: <F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition<import("@usefelps/types").JSONSchema>>, I extends InputDefinition<{
        type: "object";
    }>>(actor: ActorInstance) => (context: RequestContext) => StepApiInstance<F, S, M, I, "NO_STEPNAME">;
};
export default _default;
//# sourceMappingURL=index.d.ts.map