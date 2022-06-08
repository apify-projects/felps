import { addTimeoutToPromise, tryCancel } from '@apify/timeout';
import { BrowserCrawler, BrowserPlugin, PlaywrightCrawler, PlaywrightCrawlerOptions, PlaywrightLaunchContext } from 'apify';
import { PlaywrightLauncher } from 'apify/build/browser_launchers/playwright_launcher';
import { gotoExtended } from 'apify/build/puppeteer_utils';
import * as cheerio from 'cheerio';
import EventEmitter from 'eventemitter3';
import HttpsProxyAgent from 'https-proxy-agent';
import getPath from 'lodash.get';
import nodeFetch from 'node-fetch';
import ow from 'ow';
import { chromium, firefox, webkit } from 'playwright';

const getBrowserPlugin = (browser: string, launchContext: PlaywrightLaunchContext): BrowserPlugin => {
    let launcher;
    switch (browser) {
        case 'firefox':
            launcher = firefox;
            break;

        case 'webkit':
            launcher = webkit;
            break;

        case 'http':
        case 'chromium':
        default:
            launcher = chromium;
            break;
    }

    return new PlaywrightLauncher({ ...launchContext, launcher }).createBrowserPlugin();
};

export default class MultiCrawler extends BrowserCrawler {
    browserPlugins: { [browser: string]: BrowserPlugin } = {};
    crawlerModePath: string;
    events: EventEmitter

    static override optionsShape = {
        ...BrowserCrawler.optionsShape,
        browserPoolOptions: ow.optional.object,
        launcher: ow.optional.object,
        launchContext: ow.optional.object,
    };

    launchContext: PlaywrightLaunchContext;

    constructor(options: PlaywrightCrawlerOptions) {
        ow(options, 'PlaywrightCrawlerOptions', ow.object.exactShape(PlaywrightCrawler.optionsShape));

        const { launchContext = {}, browserPoolOptions = {}, ...browserCrawlerOptions } = options as any;

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
        this.events = new EventEmitter();
    }

    override async _navigationHandler(context: any, nextOptions: any): Promise<any> {
        return gotoExtended(context.page, context.request, nextOptions);
    }

    override async _handleRequestFunction(context: any): Promise<any> {
        const crawlerMode = getPath(context?.request?.userData || {}, this.crawlerModePath) || 'http';

        const newPageOptions = {
            id: context.id,
            browserPlugin: this.browserPlugins[crawlerMode] || this.browserPlugins.http,
        } as any;

        const useIncognitoPages = this.launchContext && this.launchContext.useIncognitoPages as boolean;
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
            const agent = proxyUrl ? HttpsProxyAgent(proxyUrl) : undefined;
            try {
                const gotoOptions = { ...this.defaultGotoOptions };

                context.response = await nodeFetch(
                    url,
                    {
                        method,
                        headers,
                        body: payload,
                        agent,
                    },
                );

                await this._executeHooks(this.preNavigationHooks, context, gotoOptions);
                tryCancel();

                const contentType = Object.fromEntries(context.response.headers.entries())['content-type'] || '';

                if (contentType.includes('application/json')) {
                    try {
                        context.json = await context.response.json();
                    } catch (error) {
                        // silent
                    };
                } else if (contentType.includes('text/html')) {
                    try {
                        const html = await context.response.text();

                        context.body = html;
                        context.$ = cheerio.load(html);
                    } catch (error) {
                        // silent
                    };
                };

                tryCancel();
                await this._executeHooks(this.postNavigationHooks, context, gotoOptions);
            } catch (error) {
                this._handleNavigationTimeout(context, error as any);
                throw error;
            }
        } else {
            page = await this.browserPool.newPage(newPageOptions) as any;
            tryCancel();

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
                    tryCancel();
                }
            }
        }

        try {
            if (page) {
                await this._handleNavigation(context);
                tryCancel();

                await this._responseHandler(context);
                tryCancel();

                try {
                    context.$ = cheerio.load(await page.content());
                } catch (error) {
                    // silent
                };
            }

            // save cookies
            // @TODO: Should we save the cookies also after/only the handle page?
            if (session && this.persistCookiesPerSession) {
                const cookies = await context.browserController.getCookies(page);
                tryCancel();
                session.setPuppeteerCookies(cookies, context.request.loadedUrl);
            }

            await addTimeoutToPromise(
                () => this.handlePageFunction(context),
                this.handlePageTimeoutMillis,
                `handlePageFunction timed out after ${this.handlePageTimeoutMillis / 1000} seconds.`,
            );
            tryCancel();

            if (session) session.markGood();
        } finally {
            if (page) {
                page.close().catch((error: any) => this.log.debug('Error while closing page', { error }));
            }
        }
    }
}
