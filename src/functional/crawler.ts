import Apify, { PlaywrightCrawler } from 'apify';
import { load } from 'cheerio';
import { gotScraping } from 'got-scraping';
import { CrawlerInstance, CrawlerOptions, RequestContext } from '../common/types';
import base from './base';
import requestMeta from './request-meta';

export const create = <CrawlerType extends Apify.BasicCrawler = PlaywrightCrawler>(options: CrawlerOptions<CrawlerType>): CrawlerInstance<CrawlerType> => {
    const { resource = DefaultCrawler } = options || {};

    return {
        ...base.create({ key: 'crawler', name: 'crawler' }),
        resource: resource as CrawlerType,
    };
};

export class DefaultCrawler extends PlaywrightCrawler {
    override async _handleNavigation(crawlingContext: RequestContext) {
        const meta = requestMeta.create(crawlingContext);
        const gotoOptions = { ...this.defaultGotoOptions };

        await this._executeHooks(this.preNavigationHooks, crawlingContext, gotoOptions);

        const { request } = crawlingContext;
        const { payload, ...restRequest } = request;
        try {
            const fetch = async () => gotScraping(
                {
                    ...restRequest as any,
                    body: payload,
                    proxyUrl: this.proxyConfiguration.newUrl(),
                });

            switch (meta.data.crawlerMode) {
                case 'ajax':
                    crawlingContext.response = await fetch();
                    break;

                case 'cheerio':
                    crawlingContext.response = await fetch();
                    crawlingContext.$ = load(crawlingContext.response.body);
                    break;

                case 'browser':
                    crawlingContext.response = await this._navigationHandler(crawlingContext, gotoOptions);
                    break;

                default:
                    throw new Error(`Unknown crawler mode: ${meta.data.crawlerMode}`);
            }
        } catch (error) {
            this._handleNavigationTimeout(crawlingContext, error as any);
            throw error;
        }

        await this._executeHooks(this.postNavigationHooks, crawlingContext, gotoOptions);
    }
};
