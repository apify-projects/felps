import { ActorInstance, ActorOptions } from './types';
export declare const create: (options?: ActorOptions | undefined) => ActorInstance;
export declare const extend: (actor: ActorInstance, options?: ActorOptions) => ActorInstance;
export declare const run: (actor: ActorInstance) => Promise<void>;
declare const _default: {
    create: (options?: ActorOptions | undefined) => ActorInstance;
    extend: (actor: ActorInstance, options?: ActorOptions) => ActorInstance;
    run: (actor: ActorInstance) => Promise<void>;
};
export default _default;
//# sourceMappingURL=actor.d.ts.map