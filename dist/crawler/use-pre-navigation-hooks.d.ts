import { ActorInstance, RequestContext } from '../types';
declare const _default: (actor: ActorInstance) => {
    flowHook(context: RequestContext): Promise<void>;
    requestHook(context: RequestContext): Promise<void>;
    trailHook(): Promise<void>;
};
export default _default;
//# sourceMappingURL=use-pre-navigation-hooks.d.ts.map