"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const timeout_1 = require("@apify/timeout");
const apify_1 = require("apify");
const playwright_launcher_1 = require("apify/build/browser_launchers/playwright_launcher");
const puppeteer_utils_1 = require("apify/build/puppeteer_utils");
const cheerio = tslib_1.__importStar(require("cheerio"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const ow_1 = tslib_1.__importDefault(require("ow"));
const playwright_1 = require("playwright");
const consts_1 = require("../consts");
class MultiCrawler extends apify_1.BrowserCrawler {
    static optionsShape = {
        ...apify_1.BrowserCrawler.optionsShape,
        browserPoolOptions: ow_1.default.optional.object,
        launcher: ow_1.default.optional.object,
        launchContext: ow_1.default.optional.object,
    };
    launchContext;
    constructor(options) {
        (0, ow_1.default)(options, 'PlaywrightCrawlerOptions', ow_1.default.object.exactShape(apify_1.PlaywrightCrawler.optionsShape));
        const { launchContext = {}, browserPoolOptions = {}, ...browserCrawlerOptions } = options;
        if (launchContext.proxyUrl) {
            throw new Error('PlaywrightCrawlerOptions.launchContext.proxyUrl is not allowed in PlaywrightCrawler.'
                + 'Use PlaywrightCrawlerOptions.proxyConfiguration');
        }
        browserPoolOptions.browserPlugins = [playwright_1.chromium, playwright_1.firefox].map((launcher) => new playwright_launcher_1.PlaywrightLauncher({ ...launchContext, launcher }).createBrowserPlugin());
        super({
            ...browserCrawlerOptions,
            browserPoolOptions,
        });
        this.launchContext = launchContext;
    }
    async _navigationHandler(context, nextOptions) {
        if (this.gotoFunction) {
            this.log.deprecated('PlaywrightCrawler.nextFunction is deprecated. Use "preNavigationHooks" and "postNavigationHooks" instead.');
            return this.gotoFunction(context, nextOptions);
        }
        return (0, puppeteer_utils_1.gotoExtended)(context.page, context.request, nextOptions);
    }
    async _handleRequestFunction(context) {
        const { crawlerMode = 'http' } = context?.request?.userData?.[consts_1.METADATA_KEY];
        const newPageOptions = {
            id: context.id,
        };
        const useIncognitoPages = this.launchContext && this.launchContext.useIncognitoPages;
        if (this.proxyConfiguration && useIncognitoPages) {
            const { session } = context;
            const proxyInfo = this.proxyConfiguration.newProxyInfo(session && session.id);
            context.session = session;
            context.proxyInfo = proxyInfo;
            newPageOptions.browserPlugin = this.browserPool.browserPlugins.find((plugin) => plugin.launcher.name === crawlerMode);
            newPageOptions.proxyUrl = proxyInfo.url;
            // Disable SSL verification for MITM proxies
            if (this.proxyConfiguration.isManInTheMiddle) {
                newPageOptions.pageOptions = {
                    ignoreHTTPSErrors: true,
                };
            }
        }
        const { url, payload } = context.request;
        let page;
        let session;
        if (crawlerMode === 'http') {
            // Handle HTTP requests
            try {
                context.response = await (0, node_fetch_1.default)(url, {
                    // ...restRequest as ReallyAny,
                    body: payload,
                    // proxyUrl: this.proxyConfiguration?.newUrl?.(),
                });
                try {
                    const html = await context.response.text();
                    context.$ = cheerio.load(html);
                }
                catch (error) {
                    // silent
                }
            }
            catch (error) {
                this._handleNavigationTimeout(context, error);
                throw error;
            }
        }
        else {
            page = await this.browserPool.newPage(newPageOptions);
            (0, timeout_1.tryCancel)();
            this._enhanceCrawlingContextWithPageInfo?.(context, page, useIncognitoPages);
            // DO NOT MOVE THIS LINE ABOVE!
            // `enhancecontextWithPageInfo` gives us a valid session.
            // For example, `sessionPoolOptions.sessionOptions.maxUsageCount` can be `1`.
            // So we must not save the session prior to making sure it was used only once, otherwise we would use it twice.
            const { request } = context;
            ({ session } = context);
            if (this.useSessionPool) {
                const sessionCookies = session.getPuppeteerCookies(request.url);
                if (sessionCookies.length) {
                    await context.browserController.setCookies(page, sessionCookies);
                    (0, timeout_1.tryCancel)();
                }
            }
        }
        try {
            if (page) {
                await this._handleNavigation(context);
                (0, timeout_1.tryCancel)();
                await this._responseHandler(context);
                (0, timeout_1.tryCancel)();
            }
            // save cookies
            // @TODO: Should we save the cookies also after/only the handle page?
            if (session && this.persistCookiesPerSession) {
                const cookies = await context.browserController.getCookies(page);
                (0, timeout_1.tryCancel)();
                session.setPuppeteerCookies(cookies, context.request.loadedUrl);
            }
            await (0, timeout_1.addTimeoutToPromise)(() => this.handlePageFunction(context), this.handlePageTimeoutMillis, `handlePageFunction timed out after ${this.handlePageTimeoutMillis / 1000} seconds.`);
            (0, timeout_1.tryCancel)();
            if (session)
                session.markGood();
        }
        finally {
            if (page) {
                page.close().catch((error) => this.log.debug('Error while closing page', { error }));
            }
        }
    }
}
exports.default = MultiCrawler;
//# sourceMappingURL=multi-crawler.js.map