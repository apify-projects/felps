import { addTimeoutToPromise, tryCancel } from '@apify/timeout';
import { BrowserCrawler, BrowserPlugin, PlaywrightCrawler, PlaywrightCrawlerOptions, PlaywrightLaunchContext } from 'apify';
import { PlaywrightLauncher } from 'apify/build/browser_launchers/playwright_launcher';
import { gotoExtended } from 'apify/build/puppeteer_utils';
import * as cheerio from 'cheerio';
import nodeFetch from 'node-fetch';
import ow from 'ow';
import { chromium, firefox } from 'playwright';
import { METADATA_KEY } from '../consts';
import { ReallyAny, RequestMetaData } from '../types';

export type MultiCrawlerOptions = PlaywrightCrawlerOptions & { launchContext: PlaywrightLaunchContext };

export default class MultiCrawler extends BrowserCrawler {
    static override optionsShape = {
        ...BrowserCrawler.optionsShape,
        browserPoolOptions: ow.optional.object,
        launcher: ow.optional.object,
        launchContext: ow.optional.object,
    };

    launchContext: PlaywrightLaunchContext;

    constructor(options: MultiCrawlerOptions) {
        ow(options, 'PlaywrightCrawlerOptions', ow.object.exactShape(PlaywrightCrawler.optionsShape));

        const {
            launchContext = {},
            browserPoolOptions = {},
            ...browserCrawlerOptions
        } = options as ReallyAny;

        if (launchContext.proxyUrl) {
            throw new Error('PlaywrightCrawlerOptions.launchContext.proxyUrl is not allowed in PlaywrightCrawler.'
                + 'Use PlaywrightCrawlerOptions.proxyConfiguration');
        }

        browserPoolOptions.browserPlugins = [chromium, firefox].map(
            (launcher) => new PlaywrightLauncher({ ...launchContext, launcher }).createBrowserPlugin(),
        );

        super({
            ...browserCrawlerOptions,
            browserPoolOptions,
        });

        this.launchContext = launchContext;
    }

    override async _navigationHandler(context: ReallyAny, nextOptions: ReallyAny) {
        if (this.gotoFunction) {
            this.log.deprecated('PlaywrightCrawler.nextFunction is deprecated. Use "preNavigationHooks" and "postNavigationHooks" instead.');
            return this.gotoFunction(context, nextOptions);
        }
        return gotoExtended(context.page, context.request, nextOptions);
    }

    override async _handleRequestFunction(context: ReallyAny) {
        const { crawlerMode = 'http' } = context?.request?.userData?.[METADATA_KEY] as RequestMetaData;

        const newPageOptions = {
            id: context.id,
        } as ReallyAny;

        const useIncognitoPages = this.launchContext && this.launchContext.useIncognitoPages as boolean;
        if (this.proxyConfiguration && useIncognitoPages) {
            const { session } = context;

            const proxyInfo = this.proxyConfiguration.newProxyInfo(session && session.id);
            context.session = session;
            context.proxyInfo = proxyInfo;

            newPageOptions.browserPlugin = this.browserPool.browserPlugins.find((plugin: BrowserPlugin) => plugin.launcher.name === crawlerMode);

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
                context.response = await nodeFetch(
                    url,
                    {
                        // ...restRequest as ReallyAny,
                        body: payload,
                        // proxyUrl: this.proxyConfiguration?.newUrl?.(),
                    });
                try {
                    const html = await context.response.text();
                    context.$ = cheerio.load(html);
                } catch (error) {
                    // silent
                }
            } catch (error) {
                this._handleNavigationTimeout(context, error as ReallyAny);
                throw error;
            }
        } else {
            page = await this.browserPool.newPage(newPageOptions) as ReallyAny;
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
                page.close().catch((error: ReallyAny) => this.log.debug('Error while closing page', { error }));
            }
        }
    }
}
