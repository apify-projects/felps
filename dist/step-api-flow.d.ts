import { ActorInstance, FlowDefinition, ModelDefinition, StepApiFlowsInstance } from './types';
export declare const create: <F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition<import("./types").JSONSchema>>>(actor: ActorInstance) => StepApiFlowsInstance<F, S, M>;
declare const _default: {
    create: <F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition<import("./types").JSONSchema>>>(actor: ActorInstance) => StepApiFlowsInstance<F, S, M>;
};
export default _default;
//# sourceMappingURL=step-api-flow.d.ts.map