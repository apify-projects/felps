import { PlaywrightCrawlerOptions, PlaywrightHook } from 'apify';
import { Events } from '.';
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

export const create = (options?: CrawlerOptions): CrawlerInstance => {
    const { launcher = MultiCrawler as ReallyAny } = options || {};

    return {
        ...base.create({ key: 'crawler', name: 'multi-crawler' }),
        launcher,
        resource: undefined,
        events: Events.create({ name: 'multi-crawler' }),
    };
};

export const run = async (crawler: CrawlerInstance, crawlerOptions?: PlaywrightCrawlerOptions): Promise<CrawlerInstance> => {
    // eslint-disable-next-line new-cap
    crawler.resource = new crawler.launcher({
        ...crawlerOptions,
        handlePageTimeoutSecs: 120,
        navigationTimeoutSecs: 60,
        maxConcurrency: 40,
        maxRequestRetries: 3,
        launchContext: {
            launchOptions: {
                headless: false,
                args: [
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                ],
            },
        },
    });

    if (crawler.resource) {
        // crawler.resource.events.on('', () => { });

        // const resource = new crawler.launcher(mergeDeepRight(crawlerOptions || {}, crawler.crawlerOptions || {}));
        if ('crawlerModePath' in crawler.resource) {
            crawler.resource.crawlerModePath = `${METADATA_KEY}.crawlerOptions.mode`;
        }
        await crawler.resource.run();
    }

    return crawler;
};

export default { create, run };
