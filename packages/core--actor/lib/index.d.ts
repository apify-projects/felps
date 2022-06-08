import * as FT from '@usefelps/types';
import { PlaywrightCrawlerOptions } from 'apify';
export declare const create: (options: FT.ActorOptions) => FT.ActorInstance;
export declare const extend: (actor: FT.ActorInstance, options?: Partial<FT.ActorOptions>) => FT.ActorInstance;
export declare const combine: (actor: FT.ActorInstance, ...actors: FT.ActorInstance[]) => FT.ActorInstance;
export declare const makeCrawlerOptions: (actor: FT.ActorInstance, options: PlaywrightCrawlerOptions) => Promise<PlaywrightCrawlerOptions>;
export declare const prefix: (actor: FT.ActorInstance, text: string) => string;
export declare const prefixStepCollection: (actor: FT.ActorInstance) => FT.ActorInstance['steps'];
export declare const prefixFlowCollection: (actor: FT.ActorInstance) => FT.ActorInstance['flows'];
export declare const prefixHookCollection: (actor: FT.ActorInstance) => FT.ActorInstance['hooks'];
export declare const run: (actor: FT.ActorInstance, input: FT.ActorInput, crawlerOptions?: PlaywrightCrawlerOptions) => Promise<void>;
declare const _default: {
    create: (options: FT.ActorOptions) => FT.ActorInstance;
    extend: (actor: FT.ActorInstance, options?: Partial<FT.ActorOptions>) => FT.ActorInstance;
    run: (actor: FT.ActorInstance, input: FT.ActorInput, crawlerOptions?: PlaywrightCrawlerOptions) => Promise<void>;
    prefix: (actor: FT.ActorInstance, text: string) => string;
    combine: (actor: FT.ActorInstance, ...actors: FT.ActorInstance[]) => FT.ActorInstance;
};
export default _default;
//# sourceMappingURL=index.d.ts.map