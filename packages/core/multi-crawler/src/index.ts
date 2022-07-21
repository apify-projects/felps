import AIOPlaywright from '@usefelps/crawlee--crawler--aio-playwright';
import { PlaywrightCrawlerOptions } from '@crawlee/playwright'
import Crawler from '@usefelps/crawler';
import * as FT from '@usefelps/types';

// & { proxyConfiguration: PlaywrightCrawlerOptions['proxyConfiguration'] | (() => Promise<PlaywrightCrawlerOptions['proxyConfiguration']>) }
export const create = (options?: PlaywrightCrawlerOptions): FT.CrawlerInstance => {
    return Crawler.create({
        ...(options || {}),
        name: 'multi-crawler',
        launcher: AIOPlaywright,
    });
};

export default { create };
