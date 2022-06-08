"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const timeout_1 = require("@apify/timeout");
const apify_1 = require("apify");
const playwright_launcher_1 = require("apify/build/browser_launchers/playwright_launcher");
const puppeteer_utils_1 = require("apify/build/puppeteer_utils");
const cheerio = tslib_1.__importStar(require("cheerio"));
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const https_proxy_agent_1 = tslib_1.__importDefault(require("https-proxy-agent"));
const lodash_get_1 = tslib_1.__importDefault(require("lodash.get"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const ow_1 = tslib_1.__importDefault(require("ow"));
const playwright_1 = require("playwright");
const getBrowserPlugin = (browser, launchContext) => {
    let launcher;
    switch (browser) {
        case 'firefox':
            launcher = playwright_1.firefox;
            break;
        case 'webkit':
            launcher = playwright_1.webkit;
            break;
        case 'http':
        case 'chromium':
        default:
            launcher = playwright_1.chromium;
            break;
    }
    return new playwright_launcher_1.PlaywrightLauncher({ ...launchContext, launcher }).createBrowserPlugin();
};
class MultiCrawler extends apify_1.BrowserCrawler {
    browserPlugins = {};
    crawlerModePath;
    events;
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
        const browserPlugins = {
            http: getBrowserPlugin('http', launchContext),
            chromium: getBrowserPlugin('chromium', launchContext),
            firefox: getBrowserPlugin('firefox', launchContext),
            webkit: getBrowserPlugin('webkit', launchContext),
        };
        browserPoolOptions.browserPlugins = Object.values(browserPlugins);
        super({ ...browserCrawlerOptions, browserPoolOptions });
        this.crawlerModePath = `crawlerOptions.mode`;
        this.browserPlugins = browserPlugins;
        this.launchContext = launchContext;
        this.events = new eventemitter3_1.default();
    }
    async _navigationHandler(context, nextOptions) {
        return (0, puppeteer_utils_1.gotoExtended)(context.page, context.request, nextOptions);
    }
    async _handleRequestFunction(context) {
        const crawlerMode = (0, lodash_get_1.default)(context?.request?.userData || {}, this.crawlerModePath) || 'http';
        const newPageOptions = {
            id: context.id,
            browserPlugin: this.browserPlugins[crawlerMode] || this.browserPlugins.http,
        };
        const useIncognitoPages = this.launchContext && this.launchContext.useIncognitoPages;
        if (this.proxyConfiguration && useIncognitoPages) {
            const { session } = context;
            const proxyInfo = this.proxyConfiguration.newProxyInfo(session && session.id);
            context.session = session;
            context.proxyInfo = proxyInfo;
            newPageOptions.proxyUrl = proxyInfo.url;
            // Disable SSL verification for MITM proxies
            if (this.proxyConfiguration.isManInTheMiddle) {
                newPageOptions.pageOptions = {
                    ignoreHTTPSErrors: true,
                };
            }
        }
        const { url, payload, headers, method = 'GET' } = context.request;
        let page;
        let session;
        if (crawlerMode === 'http') {
            // Handle HTTP requests
            // LOTS TO BE DONE HERE
            const proxyUrl = this.proxyConfiguration?.newUrl?.();
            const agent = proxyUrl ? (0, https_proxy_agent_1.default)(proxyUrl) : undefined;
            try {
                const gotoOptions = { ...this.defaultGotoOptions };
                context.response = await (0, node_fetch_1.default)(url, {
                    method,
                    headers,
                    body: payload,
                    agent,
                });
                await this._executeHooks(this.preNavigationHooks, context, gotoOptions);
                (0, timeout_1.tryCancel)();
                const contentType = Object.fromEntries(context.response.headers.entries())['content-type'] || '';
                if (contentType.includes('application/json')) {
                    try {
                        context.json = await context.response.json();
                    }
                    catch (error) {
                        // silent
                    }
                    ;
                }
                else if (contentType.includes('text/html')) {
                    try {
                        const html = await context.response.text();
                        context.body = html;
                        context.$ = cheerio.load(html);
                    }
                    catch (error) {
                        // silent
                    }
                    ;
                }
                ;
                (0, timeout_1.tryCancel)();
                await this._executeHooks(this.postNavigationHooks, context, gotoOptions);
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
                try {
                    context.$ = cheerio.load(await page.content());
                }
                catch (error) {
                    // silent
                }
                ;
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
//# sourceMappingURL=index.js.map