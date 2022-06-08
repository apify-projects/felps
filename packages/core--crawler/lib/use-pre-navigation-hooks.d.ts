import * as FT from '@usefelps/types';
declare const _default: (actor: FT.ActorInstance) => {
    flowHook(context: FT.RequestContext): Promise<void>;
    requestHook(context: FT.RequestContext): Promise<void>;
    intercepter(context: FT.RequestContext): Promise<void>;
    trailHook(): Promise<void>;
};
export default _default;
//# sourceMappingURL=use-pre-navigation-hooks.d.ts.map