import Base from '@usefelps/instance-base';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

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
    const { launcher } = options || {};

    return {
        ...Base.create({ key: 'crawler', name: 'crawler' }),
        launcher,
        resource: undefined,
        options: options?.options,
    };
};

export const run = async (crawler: FT.CrawlerInstance, crawlerOptions?: FT.ReallyAny): Promise<FT.ReallyAny> => {
    crawler.resource = new crawler.launcher(
        utils.merge({
            ...crawlerOptions,
            ...(crawler?.options || {}),
        },
            crawlerOptions || {},
        )
    );

    if (!crawler.resource) {
        throw new Error('Crawler not initialized. Cannot run.');
    }

    return (crawler as FT.ReallyAny).resource.run();
};

export default { create, run };
