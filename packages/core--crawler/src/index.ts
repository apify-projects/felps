import * as CONST from '@usefelps/core--constants';
import Events from "@usefelps/core--events";
import Base from '@usefelps/core--instance-base';
import PlaywrightCrawler from '@usefelps/core--crawler--playwright';
import * as FT from '@usefelps/types';
// import { PlaywrightCrawlerOptions, PlaywrightHook } from 'apify';

export const PRE_NAVIGATION_HOOKS: Record<string, FT.ReallyAny> = {
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

export const create = (options?: FT.CrawlerOptions): FT.CrawlerInstance => {
    const { launcher = PlaywrightCrawler as FT.ReallyAny } = options || {};

    return {
        ...Base.create({ key: 'crawler', name: 'multi-crawler' }),
        launcher,
        resource: undefined,
        events: Events.create({ name: 'multi-crawler' }),
    };
};

export const run = async (crawler: FT.CrawlerInstance, crawlerOptions?: FT.ReallyAny): Promise<FT.CrawlerInstance> => {
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
            (crawler as FT.ReallyAny).resource.crawlerModePath = `${CONST.METADATA_KEY}.crawlerOptions.mode`;
        }
        await (crawler as FT.ReallyAny).resource.run();
    }

    return crawler;
};

export default { create, run };
