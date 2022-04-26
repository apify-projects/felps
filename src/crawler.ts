import Apify, { PlaywrightCrawler, PlaywrightCrawlerOptions } from 'apify';
import { load } from 'cheerio';
// import { GotOptionsInit, gotScraping } from 'got-scraping';
import nodeFetch from 'node-fetch';
import base from './base';
import { CrawlerInstance, CrawlerOptions, RequestContext } from './types';
import requestMeta from './request-meta';

// eslint-disable-next-line max-len
export const create = <CrawlerType extends typeof Apify.BasicCrawler>(options?: CrawlerOptions<CrawlerType>): CrawlerInstance<CrawlerType> => {
    const { resource } = options || {};

    return {
        ...base.create({ key: 'crawler', name: 'crawler' }),
        resource: resource || DefaultCrawler as any,
    };
};

export const run = async (crawler: CrawlerInstance<any>, options?: PlaywrightCrawlerOptions): Promise<void> => {
    // eslint-disable-next-line new-cap
    await new crawler.resource(options).run();
};

export class DefaultCrawler extends PlaywrightCrawler {
    override async _handleNavigation(RequestContext: RequestContext) {
        const meta = requestMeta.create(RequestContext);
        const gotoOptions = { ...this.defaultGotoOptions };

        await this._executeHooks(this.preNavigationHooks, RequestContext, gotoOptions);

        const { request } = RequestContext;
        const { url, payload } = request;
        try {
            const fetch = async () => nodeFetch(
                url,
                {
                    // ...restRequest as reallyAny,
                    body: payload,
                    // proxyUrl: this.proxyConfiguration?.newUrl?.(),
                });

            switch (meta.data.crawlerMode) {
                case 'browser':
                    RequestContext.response = await this._navigationHandler(RequestContext, gotoOptions);
                    break;

                case 'default':
                default:
                    RequestContext.response = await fetch();
                    try {
                        const html = await RequestContext.response.text();
                        RequestContext.$ = load(html);
                    } catch (error) {
                        // silent
                    }
            }
        } catch (error) {
            this._handleNavigationTimeout(RequestContext, error as any);
            throw error;
        }

        await this._executeHooks(this.postNavigationHooks, RequestContext, gotoOptions);
    }
};

export default { create, run };
