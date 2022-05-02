"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.create = exports.PRESETS = exports.PRE_NAVIGATION_HOOKS = void 0;
const tslib_1 = require("tslib");
const ramda_1 = require("ramda");
const base_1 = tslib_1.__importDefault(require("./base"));
const multi_crawler_1 = tslib_1.__importDefault(require("./sdk/multi-crawler"));
exports.PRE_NAVIGATION_HOOKS = {
    async excludeResources({ page }) {
        const RESOURCE_EXCLUSTIONS = ['image', 'stylesheet', 'media', 'font', 'other'];
        await page.route('**/*', (route) => {
            return RESOURCE_EXCLUSTIONS.includes(route.request().resourceType())
                ? route.abort()
                : route.continue();
        });
    },
    async domContentLoaded(_, nextOptions) {
        nextOptions.waitUntil = 'domcontentloaded';
    },
};
exports.PRESETS = {
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
            exports.PRE_NAVIGATION_HOOKS.excludeResources,
        ],
    },
};
const create = (options) => {
    const { launcher, crawlerOptions = exports.PRESETS.DEFAULT } = options || {};
    return {
        ...base_1.default.create({ key: 'crawler', name: 'multi-crawler' }),
        launcher: launcher || multi_crawler_1.default,
        crawlerOptions,
    };
};
exports.create = create;
const run = async (crawler, crawlerOptions) => {
    // eslint-disable-next-line new-cap
    await new crawler.launcher((0, ramda_1.mergeDeepRight)(crawlerOptions || {}, crawler.crawlerOptions || {})).run();
};
exports.run = run;
exports.default = { create: exports.create, run: exports.run };
//# sourceMappingURL=crawler.js.map