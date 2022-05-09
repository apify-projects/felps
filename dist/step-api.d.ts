import { ActorInstance, FlowDefinition, InputDefinition, ModelDefinition, RequestContext, StepApiInstance } from './types';
export declare const create: <F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition<import("./types").JSONSchema>>, I extends InputDefinition<{
    type: "object";
}>>(actor: ActorInstance) => (context: RequestContext) => StepApiInstance<F, S, M, I, "nope">;
declare const _default: {
    create: <F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition<import("./types").JSONSchema>>, I extends InputDefinition<{
        type: "object";
    }>>(actor: ActorInstance) => (context: RequestContext) => StepApiInstance<F, S, M, I, "nope">;
};
export default _default;
//# sourceMappingURL=step-api.d.ts.map