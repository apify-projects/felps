import { addTimeoutToPromise, tryCancel } from '@apify/timeout';
import { BrowserCrawler } from '@crawlee/browser';
import { BrowserPlugin, CommonPage } from '@crawlee/browser-pool';
import { Request } from '@crawlee/core';
import { CrawlingContext, EnqueueLinksOptions, mergeCookies, PlaywrightCookie, PlaywrightCrawlerOptions, PlaywrightCrawlingContext, PlaywrightLaunchContext, PlaywrightLauncher, Session } from '@crawlee/playwright';
import { Dictionary } from '@crawlee/types';
import { CheerioRoot } from '@crawlee/utils';
import * as FT from '@usefelps/types';
import { gotScraping, Method, OptionsInit, Request as GotRequest, TimeoutError } from 'got-scraping';
import type { IncomingMessage } from 'http';
import getPath from 'lodash.get';
import { chromium, firefox, webkit } from 'playwright';
import { Cookie } from 'tough-cookie';

export interface RequestFunctionOptions {
    request: Request;
    session?: Session;
    proxyUrl?: string;
    gotOptions: OptionsInit;
}

export type CheerioCrawlerEnqueueLinksOptions = Omit<EnqueueLinksOptions, 'urls' | 'requestQueue'>;

export interface CheerioCrawlingContext extends CrawlingContext<Dictionary> {
    $: CheerioRoot;
    body: (string | Buffer);
    json: Dictionary;
    contentType: { type: string; encoding: string };
    response: IncomingMessage;
}

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

export type CustomPlaywrightCrawlerOptions = PlaywrightCrawlerOptions & {
    mode: FT.RequestCrawlerMode,
};

export const CONST = {
    CRAWLER_OPTIONS: '__crawlerOptions'
};

export default class CustomPlaywrightCrawler extends BrowserCrawler {
    protected browserPlugins: { [browser: string]: BrowserPlugin } = {};
    protected requestTimeoutMillis: number;
    protected ignoreSslErrors: boolean;
    // events: EventEmitter

    constructor(options: PlaywrightCrawlerOptions) {
        const { launchContext = {}, browserPoolOptions = {}, ...browserCrawlerOptions } = options;

        const browserPlugins = {
            http: getBrowserPlugin('http', launchContext),
            chromium: getBrowserPlugin('chromium', launchContext),
            firefox: getBrowserPlugin('firefox', launchContext),
            webkit: getBrowserPlugin('webkit', launchContext),
        };

        browserPoolOptions.browserPlugins = Object.values(browserPlugins);
        // browserPoolOptions.prePageCreateHooks = [
        //     (pageId, browserController, pageOptions) => {
        //         // Change page configuration here based on request
        //     },
        // ],

        super({ ...browserCrawlerOptions, launchContext, browserPoolOptions } as FT.ReallyAny);

        this.browserPlugins = browserPlugins;
        this.launchContext = launchContext;
        // this.events = new EventEmitter();
    }


    protected override async _applyCookies({ session, request, page }: PlaywrightCrawlingContext, preHooksCookies: string, postHooksCookies: string, gotOptions?: OptionsInit) {
        console.log('_applyCookies');

        if (page) {
            const sessionCookie = session?.getPuppeteerCookies(request.url) ?? [];
            const parsedPreHooksCookies = preHooksCookies.split(/ *; */).map((c) => Cookie.parse(c)?.toJSON() as PlaywrightCookie | undefined);
            const parsedPostHooksCookies = postHooksCookies.split(/ *; */).map((c) => Cookie.parse(c)?.toJSON() as PlaywrightCookie | undefined);

            await page.context().addCookies(
                [
                    ...sessionCookie,
                    ...parsedPreHooksCookies,
                    ...parsedPostHooksCookies,
                ].filter((c): c is PlaywrightCookie => c !== undefined),
            );
        } else {
            const sessionCookie = session?.getCookieString(request.url) ?? '';
            const alteredGotOptionsCookies = (gotOptions.headers?.Cookie ?? gotOptions.headers?.cookie ?? '') as string;

            const mergedCookie = mergeCookies(request.url, [sessionCookie, preHooksCookies, alteredGotOptionsCookies, postHooksCookies]);

            gotOptions.headers ??= {};
            gotOptions.headers.Cookie = mergedCookie;
        }
    }

    protected _getRequestOptions(request: Request, session?: Session, proxyUrl?: string, gotOptions?: OptionsInit) {
        console.log('_getRequestOptions');

        const requestOptions: OptionsInit & { isStream: true } = {
            url: request.url,
            method: request.method as Method,
            proxyUrl,
            timeout: { request: this.requestTimeoutMillis },
            sessionToken: session,
            ...gotOptions,
            headers: { ...request.headers, ...gotOptions?.headers },
            https: {
                ...gotOptions?.https,
                rejectUnauthorized: !this.ignoreSslErrors,
            },
            isStream: true,
        };

        if (this.proxyConfiguration && this.proxyConfiguration.isManInTheMiddle) {
            requestOptions.https = {
                ...requestOptions.https,
                rejectUnauthorized: false,
            };
        }

        if (/PATCH|POST|PUT/.test(request.method)) requestOptions.body = request.payload;

        return requestOptions;
    }

    private _requestAsBrowser = (options: OptionsInit & { isStream: true }) => {
        console.log('_requestAsBrowser');

        return new Promise<IncomingMessage>((resolve, reject) => {
            const stream = gotScraping(options);

            stream.on('error', reject);
            stream.on('response', () => {
                resolve(addResponsePropertiesToStream(stream));
            });
        });
    };

    protected _handleRequestTimeout(session?: Session) {
        session?.markBad();
        throw new Error(`request timed out after ${this.requestHandlerTimeoutMillis / 1000} seconds.`);
    }

    override async _navigationHandler(context: PlaywrightCrawlingContext, gotoOptions?: FT.ReallyAny): Promise<any> {

        const crawlerOptions = getPath(context?.request?.userData || {}, CONST.CRAWLER_OPTIONS) as CustomPlaywrightCrawlerOptions;
        const { mode = 'http' } = crawlerOptions || {};

        console.log('_navigationHandler', { mode });

        if (mode === 'http') {
            const { session, request, proxyUrl, gotOptions } = context as unknown as RequestFunctionOptions;
            const opts = this._getRequestOptions(request, session, proxyUrl, gotOptions);

            await addTimeoutToPromise(
                async () => {
                    try {
                        return await this._requestAsBrowser(opts);
                    } catch (e) {
                        if (e instanceof TimeoutError) {
                            this._handleRequestTimeout(session);
                            return undefined as unknown as IncomingMessage;
                        }

                        throw e;
                    }
                },
                this.requestTimeoutMillis,
                `request timed out after ${this.requestTimeoutMillis / 1000} seconds.`,
            );
        }

        return (context as PlaywrightCrawlingContext).page.goto(context.request.url, gotoOptions);
    }


    override async _handleNavigation(crawlingContext: FT.RequestContext) {
        console.log('_handleNavigation');
        console.log(crawlingContext);

        if ('page' in crawlingContext) {
            const gotoOptions = { timeout: this.navigationTimeoutMillis } as Dictionary;

            const preNavigationHooksCookies = this._getCookieHeaderFromRequest(crawlingContext.request);

            await this._executeHooks(this.preNavigationHooks, crawlingContext as FT.ReallyAny, gotoOptions);
            tryCancel();

            const postNavigationHooksCookies = this._getCookieHeaderFromRequest(crawlingContext.request);

            await this._applyCookies(crawlingContext as FT.ReallyAny, preNavigationHooksCookies, postNavigationHooksCookies);

            try {
                crawlingContext.response = await this._navigationHandler(crawlingContext as FT.ReallyAny, gotoOptions) ?? undefined;
            } catch (error) {
                this._handleNavigationTimeout(crawlingContext as FT.ReallyAny, error as Error);

                throw error;
            }

            tryCancel();
            await this._executeHooks(this.postNavigationHooks, crawlingContext as FT.ReallyAny, gotoOptions);

        } else {
            const gotOptions = {} as OptionsInit;
            const { request } = crawlingContext as CheerioCrawlingContext;
            const preNavigationHooksCookies = this._getCookieHeaderFromRequest(request);

            // Execute pre navigation hooks before applying session pool cookies,
            // as they may also set cookies in the session
            await this._executeHooks(this.preNavigationHooks, crawlingContext as FT.ReallyAny, gotOptions);
            tryCancel();

            const postNavigationHooksCookies = this._getCookieHeaderFromRequest(request);

            this._applyCookies(crawlingContext as FT.ReallyAny, preNavigationHooksCookies, postNavigationHooksCookies, gotOptions);

            crawlingContext.response = await this._navigationHandler(crawlingContext as FT.ReallyAny) ?? undefined;
            tryCancel();

            await this._executeHooks(this.postNavigationHooks, crawlingContext as FT.ReallyAny, gotOptions);
            tryCancel();
        }
    }

    override async _responseHandler(crawlingContext: FT.ReallyAny): Promise<void> {
        const { response, session, request, page } = crawlingContext;

        if (this.sessionPool && response && session) {
            if (typeof response === 'object' && typeof response.status === 'function') {
                this._throwOnBlockedRequest(session, response.status());
            } else {
                this.log.debug('Got a malformed Browser response.', { request, response });
            }
        }

        if (page) request.loadedUrl = await page.url();
        else request.loadedUrl = request.url;
    }


    override async _runRequestHandler(context: PlaywrightCrawlingContext) {
        console.log('_runRequestHandler');

        // registerUtilsToContext(context);

        const crawlerOptions = getPath(context?.request?.userData || {}, '__crawlerOptions') as CustomPlaywrightCrawlerOptions;
        const { mode = 'http' } = crawlerOptions || {};

        const newPageOptions: Dictionary = {
            id: context.id,
            browserPlugin: this.browserPlugins[mode] || this.browserPlugins.http,
            pageOptions: {},
            proxyUrl: undefined
        };

        const useIncognitoPages = this.launchContext?.useIncognitoPages;

        if (this.proxyConfiguration && useIncognitoPages) {
            const { session } = context;

            const proxyInfo = await this.proxyConfiguration.newProxyInfo(session?.id);
            context.proxyInfo = proxyInfo;

            newPageOptions.proxyUrl = proxyInfo.url;

            if (this.proxyConfiguration.isManInTheMiddle) {
                newPageOptions.pageOptions = {
                    ignoreHTTPSErrors: true,
                };
            }
        }

        // const { url, payload, headers, method = 'GET' } = context.request;
        let page;

        if (mode !== 'http') {
            page = await this.browserPool.newPage(newPageOptions) as CommonPage;
            tryCancel();

            this._enhanceCrawlingContextWithPageInfo?.(context, page, useIncognitoPages);
        }

        const { request, session } = context;

        try {
            if (!request.skipNavigation) {
                await this._handleNavigation(context);
                tryCancel();

                await this._responseHandler(context);
                tryCancel();

                // save cookies
                // TODO: Should we save the cookies also after/only the handle page?
                if (this.persistCookiesPerSession) {
                    if (page) {
                        //TODO: Handle it when no page
                        const cookies = await context.browserController.getCookies(page);
                        tryCancel();
                        session?.setPuppeteerCookies(cookies, request.loadedUrl!);
                    }
                }
            }

            await addTimeoutToPromise(
                () => Promise.resolve(this.userProvidedRequestHandler(context)),
                this.requestHandlerTimeoutMillis,
                `requestHandler timed out after ${this.requestHandlerTimeoutMillis / 1000} seconds.`,
            );
            tryCancel();

            if (session) session.markGood();
        } finally {
            if (page) {
                page.close().catch((error: Error) => this.log.debug('Error while closing page', { error }));
            }
        }
    }

}

function addResponsePropertiesToStream(stream: GotRequest) {
    const properties = [
        'statusCode', 'statusMessage', 'headers',
        'complete', 'httpVersion', 'rawHeaders',
        'rawTrailers', 'trailers', 'url',
        'request',
    ];

    const response = stream.response!;

    response.on('end', () => {
        // @ts-expect-error
        Object.assign(stream.rawTrailers, response.rawTrailers);
        // @ts-expect-error
        Object.assign(stream.trailers, response.trailers);

        // @ts-expect-error
        stream.complete = response.complete;
    });

    for (const prop of properties) {
        if (!(prop in stream)) {
            stream[prop] = response[prop as keyof IncomingMessage];
        }
    }

    return stream as unknown as IncomingMessage;
}
