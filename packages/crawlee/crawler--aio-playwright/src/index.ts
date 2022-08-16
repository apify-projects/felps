import { DomHandler } from 'htmlparser2';
import { WritableStream } from 'htmlparser2/lib/WritableStream';
import { addTimeoutToPromise, tryCancel } from '@apify/timeout';
import { concatStreamToBuffer, readStreamToString } from '@apify/utilities';
import { BrowserCrawler } from '@crawlee/browser';
import { BrowserPlugin, CommonPage } from '@crawlee/browser-pool';
import { Request } from '@crawlee/core';
import type { Cookie as CookieObject } from '@crawlee/types';
import { CrawlingContext, EnqueueLinksOptions, mergeCookies, PlaywrightCrawlerOptions, PlaywrightCrawlingContext, PlaywrightLaunchContext, PlaywrightLauncher, Session } from '@crawlee/playwright';
import { Dictionary } from '@crawlee/types';
import { METADATA_CRAWLER_MODE_PATH } from '@usefelps/constants';
import { CheerioRoot } from '@crawlee/utils';
import * as FT from '@usefelps/types';
import { gotScraping, Method, OptionsInit, Request as GotRequest, TimeoutError } from 'got-scraping';
import type { IncomingMessage } from 'http';
import getPath from 'lodash.get';
import { chromium, firefox, webkit } from 'playwright';
import { Cookie } from 'tough-cookie';
import iconv from 'iconv-lite';
import util from 'util';
import * as cheerio from 'cheerio';
import { IncomingHttpHeaders } from 'http';
import contentTypeParser from 'content-type';
import mime from 'mime-types';
import { extname } from 'path';

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

const HTML_AND_XML_MIME_TYPES = ['text/html', 'text/xml', 'application/xhtml+xml', 'application/xml'];
const APPLICATION_JSON_MIME_TYPE = 'application/json';

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

export type AIOPlaywrightCrawlerOptions = PlaywrightCrawlerOptions & {
    mode: FT.RequestCrawlerMode,
};

export const CONST = {
    CRAWLER_MODE: '__crawlerMode'
};

export default class AIOPlaywrightCrawler extends BrowserCrawler {
    protected browserPlugins: { [browser: string]: BrowserPlugin } = {};
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
        // console.log('_applyCookies');
        if (page) {
            const sessionCookie = session?.getCookies(request.url) ?? [];
            const parsedPreHooksCookies = preHooksCookies.split(/ *; */).map((c) => Cookie.parse(c)?.toJSON() as CookieObject | undefined);
            const parsedPostHooksCookies = postHooksCookies.split(/ *; */).map((c) => Cookie.parse(c)?.toJSON() as CookieObject | undefined);

            await page.context().addCookies(
                [
                    ...sessionCookie,
                    ...parsedPreHooksCookies,
                    ...parsedPostHooksCookies,
                ].filter((c): c is CookieObject => c !== undefined),
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
        // console.log('_getRequestOptions');

        const requestOptions: OptionsInit & { isStream: true } = {
            url: request.url,
            method: request.method as Method,
            proxyUrl,
            timeout: { request: this.requestHandlerTimeoutMillis },
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
        // console.log('_requestAsBrowser');

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

        const crawlerMode = getPath(context?.request?.userData || {}, CONST.CRAWLER_MODE) || getPath(context?.request?.userData, METADATA_CRAWLER_MODE_PATH) || 'http';

        if (crawlerMode === 'http') {
            const { session, request, proxyUrl, gotOptions } = context as unknown as RequestFunctionOptions;
            const opts = this._getRequestOptions(request, session, proxyUrl, gotOptions);

            return addTimeoutToPromise(
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
                this.requestHandlerTimeoutMillis,
                `request timed out after ${this.requestHandlerTimeoutMillis / 1000} seconds.`,
            );
        }

        return (context as PlaywrightCrawlingContext).page.goto(context.request.url, gotoOptions);
    }


    override async _handleNavigation(crawlingContext: FT.ReallyAny) {
        // console.log('_handleNavigation');

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
            const { request, gotOptions = {} } = crawlingContext as (CheerioCrawlingContext & RequestFunctionOptions);
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

    protected async _parseHtmlToDom(response: IncomingMessage) {
        return new Promise((resolve, reject) => {
            const domHandler = new DomHandler((err, dom) => {
                if (err) reject(err);
                else resolve(dom);
            });
            const parser = new WritableStream(domHandler, { decodeEntities: true });
            parser.on('error', reject);
            response
                .on('error', reject)
                .pipe(parser);
        });
    }

    protected async _parseResponse(request: Request, responseStream: IncomingMessage) {
        const { statusCode } = responseStream;
        const { type, charset } = parseContentTypeFromResponse(responseStream);
        const { response, encoding } = this._encodeResponse(request, responseStream, charset);
        const contentType = { type, encoding };

        if (statusCode! >= 500) {
            const body = await readStreamToString(response, encoding);

            // Errors are often sent as JSON, so attempt to parse them,
            // despite Accept header being set to text/html.
            if (type === APPLICATION_JSON_MIME_TYPE) {
                const errorResponse = JSON.parse(body);
                let { message } = errorResponse;
                if (!message) message = util.inspect(errorResponse, { depth: 1, maxArrayLength: 10 });
                throw new Error(`${statusCode} - ${message}`);
            }

            // It's not a JSON so it's probably some text. Get the first 100 chars of it.
            throw new Error(`${statusCode} - Internal Server Error: ${body.substr(0, 100)}`);
        } else if (HTML_AND_XML_MIME_TYPES.includes(type)) {
            const dom = await this._parseHtmlToDom(response);
            return ({ dom, isXml: type.includes('xml'), response, contentType });
        } else {
            const body = await concatStreamToBuffer(response);
            return { body, response, contentType };
        }
    }

    protected _encodeResponse(request: Request, response: IncomingMessage, encoding: BufferEncoding): {
        encoding: BufferEncoding;
        response: IncomingMessage;
    } {
        // Fall back to utf-8 if we still don't have encoding.
        const utf8 = 'utf8';
        if (!encoding) return { response, encoding: utf8 };

        // This means that the encoding is one of Node.js supported
        // encodings and we don't need to re-encode it.
        if (Buffer.isEncoding(encoding)) return { response, encoding };

        // Try to re-encode a variety of unsupported encodings to utf-8
        if (iconv.encodingExists(encoding)) {
            const encodeStream = iconv.encodeStream(utf8);
            const decodeStream = iconv.decodeStream(encoding).on('error', (err) => encodeStream.emit('error', err));
            response.on('error', (err: Error) => decodeStream.emit('error', err));
            const encodedResponse = response.pipe(decodeStream).pipe(encodeStream) as NodeJS.ReadWriteStream & {
                statusCode?: number;
                headers: IncomingHttpHeaders;
                url?: string;
            };
            encodedResponse.statusCode = response.statusCode;
            encodedResponse.headers = response.headers;
            encodedResponse.url = response.url;
            return {
                response: encodedResponse as any,
                encoding: utf8,
            };
        }

        throw new Error(`Resource ${request.url} served with unsupported charset/encoding: ${encoding}`);
    }

    override async _responseHandler(crawlingContext: FT.ReallyAny): Promise<void> {
        const { response, session, request, page } = crawlingContext;

        if (!page) {
            const { dom, isXml, body, contentType, response } = await this._parseResponse(request, crawlingContext.response!);
            tryCancel();

            if (this.useSessionPool) {
                this._throwOnBlockedRequest(session!, response.statusCode!);
            }

            if (this.persistCookiesPerSession) {
                session!.setCookiesFromResponse(response);
            }

            const $ = dom
                ? cheerio.load(dom as string, {
                    xmlMode: isXml,
                    // Recent versions of cheerio use parse5 as the HTML parser/serializer. It's more strict than htmlparser2
                    // and not good for scraping. It also does not have a great streaming interface.
                    // Here we tell cheerio to use htmlparser2 for serialization, otherwise the conflict produces weird errors.
                    _useHtmlParser2: true,
                } as FT.ReallyAny) // CheerioOptions
                : null;

            crawlingContext.$ = $!;
            crawlingContext.contentType = contentType;
            crawlingContext.response = response;

            crawlingContext.body = dom ? (isXml ? $!.xml() : $!.html({ decodeEntities: false })) : body;

            try {
                crawlingContext.json = JSON.parse(typeof body === 'string' ? body : body?.toString?.() as string);
            } catch (error) {
                crawlingContext.json = undefined;
            }
        }

        if (page) {
            crawlingContext.body = await page.content();
            try {
                crawlingContext.$ = cheerio.load(crawlingContext.body);
            } catch (error) {
                // silent
            }
        }

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

    override async _runRequestHandler(context: PlaywrightCrawlingContext<Dictionary<any>>) {
        const crawlerMode = getPath(context?.request?.userData || {}, CONST.CRAWLER_MODE) || getPath(context?.request?.userData, METADATA_CRAWLER_MODE_PATH) || 'http';

        const newPageOptions: Dictionary = {
            id: context.id,
            browserPlugin: this.browserPlugins[crawlerMode] || this.browserPlugins.http,
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

        if (crawlerMode !== 'http') {
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
                        session?.setCookies(cookies, request.loadedUrl!);
                    } else {
                        session!.setCookiesFromResponse(context.response);
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

/**
 * Gets parsed content type from response object
 * @param response HTTP response object
 */
 function parseContentTypeFromResponse(response: IncomingMessage): { type: string; charset: BufferEncoding } {
    const { url, headers } = response;
    let parsedContentType;

    if (headers['content-type']) {
        try {
            parsedContentType = contentTypeParser.parse(headers['content-type']);
        } catch {
            // Can not parse content type from Content-Type header. Try to parse it from file extension.
        }
    }

    // Parse content type from file extension as fallback
    if (!parsedContentType) {
        const parsedUrl = new URL(url);
        const contentTypeFromExtname = mime.contentType(extname(parsedUrl.pathname))
            || 'application/octet-stream; charset=utf-8'; // Fallback content type, specified in https://tools.ietf.org/html/rfc7231#section-3.1.1.5
        parsedContentType = contentTypeParser.parse(contentTypeFromExtname);
    }

    return {
        type: parsedContentType.type,
        charset: parsedContentType.parameters.charset as BufferEncoding,
    };
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
