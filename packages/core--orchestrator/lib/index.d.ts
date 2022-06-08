import * as FT from '@usefelps/types';
export declare const create: (actor: FT.ActorInstance) => FT.OrchestratorInstance;
export declare const run: (orchestrator: FT.OrchestratorInstance, context: FT.RequestContext, api: FT.ReallyAny) => Promise<void>;
declare const _default: {
    create: (actor: FT.ActorInstance) => FT.OrchestratorInstance;
    run: (orchestrator: FT.OrchestratorInstance, context: FT.RequestContext, api: any) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map