import { PlaywrightCrawlerOptions, PlaywrightHook } from 'apify';
import { CrawlerInstance, CrawlerOptions } from './types';
export declare const PRE_NAVIGATION_HOOKS: Record<string, PlaywrightHook>;
export declare const PRESETS: Record<string, Partial<PlaywrightCrawlerOptions>>;
export declare const create: (options?: CrawlerOptions | undefined) => CrawlerInstance;
export declare const run: (crawler: CrawlerInstance, crawlerOptions?: PlaywrightCrawlerOptions | undefined) => Promise<void>;
declare const _default: {
    create: (options?: CrawlerOptions | undefined) => CrawlerInstance;
    run: (crawler: CrawlerInstance, crawlerOptions?: PlaywrightCrawlerOptions | undefined) => Promise<void>;
};
export default _default;
//# sourceMappingURL=crawler.d.ts.map