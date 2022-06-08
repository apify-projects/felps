import * as FT from '@usefelps/types';
import { PlaywrightCrawlerOptions, PlaywrightHook } from 'apify';
export declare const PRE_NAVIGATION_HOOKS: Record<string, PlaywrightHook>;
export declare const create: (options?: FT.CrawlerOptions) => FT.CrawlerInstance;
export declare const run: (crawler: FT.CrawlerInstance, crawlerOptions?: PlaywrightCrawlerOptions) => Promise<FT.CrawlerInstance>;
declare const _default: {
    create: (options?: FT.CrawlerOptions) => FT.CrawlerInstance;
    run: (crawler: FT.CrawlerInstance, crawlerOptions?: PlaywrightCrawlerOptions) => Promise<FT.CrawlerInstance>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map