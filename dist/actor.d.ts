import { ActorCrawlerOptions, ActorInput, ActorInstance, ActorOptions } from './types';
export declare const create: (options: ActorOptions) => ActorInstance;
export declare const extend: (actor: ActorInstance, options?: Partial<ActorOptions>) => ActorInstance;
export declare const combine: (actor: ActorInstance, ...actors: ActorInstance[]) => ActorInstance;
export declare const makeCrawlerOptions: (actor: ActorInstance, options: ActorCrawlerOptions) => Promise<ActorCrawlerOptions>;
export declare const prefix: (actor: ActorInstance, text: string) => string;
export declare const prefixSteps: (actor: ActorInstance) => ActorInstance['steps'];
export declare const prefixFlows: (actor: ActorInstance) => ActorInstance['flows'];
export declare const prefixHooks: (actor: ActorInstance) => ActorInstance['hooks'];
export declare const run: (actor: ActorInstance, input: ActorInput, crawlerOptions?: import("apify").PlaywrightCrawlerOptions | undefined) => Promise<void>;
declare const _default: {
    create: (options: ActorOptions) => ActorInstance;
    extend: (actor: ActorInstance, options?: Partial<ActorOptions>) => ActorInstance;
    run: (actor: ActorInstance, input: ActorInput, crawlerOptions?: import("apify").PlaywrightCrawlerOptions | undefined) => Promise<void>;
    prefix: (actor: ActorInstance, text: string) => string;
    combine: (actor: ActorInstance, ...actors: ActorInstance[]) => ActorInstance;
};
export default _default;
//# sourceMappingURL=actor.d.ts.map