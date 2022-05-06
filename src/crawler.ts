import { PlaywrightCrawlerOptions, PlaywrightHook } from 'apify';
import base from './base';
import { METADATA_KEY } from './consts';
import MultiCrawler from './sdk/multi-crawler';
import { CrawlerInstance, CrawlerOptions, ReallyAny } from './types';

export const PRE_NAVIGATION_HOOKS: Record<string, PlaywrightHook> = {
    async excludeResources({ page }) {
        const RESOURCE_EXCLUSTIONS = ['image', 'stylesheet', 'media', 'font', 'other'];
        await page?.route?.('**/*', (route) => {
            return RESOURCE_EXCLUSTIONS.includes(route.request().resourceType())
                ? route.abort()
                : route.continue();
        });
    },
    async domContentLoaded(_, nextOptions) {
        nextOptions.waitUntil = 'domcontentloaded';
    },
};

export const PRESETS: Record<string, Partial<PlaywrightCrawlerOptions>> = {
    DEFAULT: {
        handlePageTimeoutSecs: 120,
        navigationTimeoutSecs: 60,
        maxConcurrency: 40,
        maxRequestRetries: 3,
        launchContext: {
            launchOptions: {
                headless: true,
                args: [
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                ],
            },
        },
        preNavigationHooks: [
            PRE_NAVIGATION_HOOKS.excludeResources,
        ],
    },
};

export const create = (options?: CrawlerOptions): CrawlerInstance => {
    const { launcher, crawlerOptions = PRESETS.DEFAULT } = options || {};

    return {
        ...base.create({ key: 'crawler', name: 'multi-crawler' }),
        launcher: launcher || MultiCrawler as ReallyAny,
        crawlerOptions,
    };
};

export const run = async (crawler: CrawlerInstance, crawlerOptions?: PlaywrightCrawlerOptions): Promise<void> => {
    // eslint-disable-next-line new-cap
    const resource = new crawler.launcher(crawlerOptions || {});
    // const resource = new crawler.launcher(mergeDeepRight(crawlerOptions || {}, crawler.crawlerOptions || {}));
    if ('crawlerModePath' in resource) {
        resource.crawlerModePath = `${METADATA_KEY}.crawlerMode`;
    }
    await resource.run();
};

export default { create, run };
