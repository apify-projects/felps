import { ActorInstance, OrchestratorInstance, ReallyAny, RequestContext } from './types';
export declare const create: (actor: ActorInstance) => OrchestratorInstance;
export declare const run: (orchestrator: OrchestratorInstance, context: RequestContext, api: ReallyAny) => Promise<void>;
declare const _default: {
    create: (actor: ActorInstance) => OrchestratorInstance;
    run: (orchestrator: OrchestratorInstance, context: RequestContext, api: any) => Promise<void>;
};
export default _default;
//# sourceMappingURL=orchestrator.d.ts.map