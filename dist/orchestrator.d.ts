import { ActorInstance, OrchestratorInstance, ReallyAny, RequestContext, StepApiInstance } from './types';
export declare const create: (actor: ActorInstance) => OrchestratorInstance;
export declare const run: (orchestrator: OrchestratorInstance, context: RequestContext, api: StepApiInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>) => Promise<void>;
declare const _default: {
    create: (actor: ActorInstance) => OrchestratorInstance;
    run: (orchestrator: OrchestratorInstance, context: RequestContext, api: StepApiInstance<any, any, any, any>) => Promise<void>;
};
export default _default;
//# sourceMappingURL=orchestrator.d.ts.map