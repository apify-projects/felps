import Apify, { PlaywrightCrawler, PlaywrightCrawlerOptions } from 'apify';
import { load } from 'cheerio';
// import { GotOptionsInit, gotScraping } from 'got-scraping';
import nodeFetch from 'node-fetch';
import base from './base';
import { CrawlerInstance, CrawlerOptions, RequestContext } from './common/types';
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
    override async _handleNavigation(crawlingContext: RequestContext) {
        const meta = requestMeta.create(crawlingContext);
        const gotoOptions = { ...this.defaultGotoOptions };

        await this._executeHooks(this.preNavigationHooks, crawlingContext, gotoOptions);

        const { request } = crawlingContext;
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
                case 'ajax':
                    crawlingContext.response = await fetch();
                    break;

                case 'browser':
                    crawlingContext.response = await this._navigationHandler(crawlingContext, gotoOptions);
                    break;

                case 'cheerio':
                default:
                    crawlingContext.response = await fetch();
                    crawlingContext.$ = load(await crawlingContext.response.text());
                    break;
            }
        } catch (error) {
            this._handleNavigationTimeout(crawlingContext, error as any);
            throw error;
        }

        await this._executeHooks(this.postNavigationHooks, crawlingContext, gotoOptions);
    }
};

export default { create, run };
