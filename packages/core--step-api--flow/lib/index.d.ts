import { ActorInstance, FlowDefinition, ModelDefinition, StepApiFlowsInstance } from '@usefelps/types';
export declare const create: <F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition<import("@usefelps/types").JSONSchema>>>(actor: ActorInstance) => StepApiFlowsInstance<F, S, M>;
declare const _default: {
    create: <F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition<import("@usefelps/types").JSONSchema>>>(actor: ActorInstance) => StepApiFlowsInstance<F, S, M>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map