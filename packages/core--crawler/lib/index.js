"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.create = exports.PRE_NAVIGATION_HOOKS = void 0;
const tslib_1 = require("tslib");
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__events_1 = tslib_1.__importDefault(require("@usefelps/core--events"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const crawler_playwright_1 = tslib_1.__importDefault(require("@usefelps/crawler-playwright"));
exports.PRE_NAVIGATION_HOOKS = {
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
const create = (options) => {
    const { launcher = crawler_playwright_1.default } = options || {};
    return {
        ...core__instance_base_1.default.create({ key: 'crawler', name: 'multi-crawler' }),
        launcher,
        resource: undefined,
        events: core__events_1.default.create({ name: 'multi-crawler' }),
    };
};
exports.create = create;
const run = async (crawler, crawlerOptions) => {
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
            crawler.resource.crawlerModePath = `${CONST.METADATA_KEY}.crawlerOptions.mode`;
        }
        await crawler.resource.run();
    }
    return crawler;
};
exports.run = run;
exports.default = { create: exports.create, run: exports.run };
//# sourceMappingURL=index.js.map