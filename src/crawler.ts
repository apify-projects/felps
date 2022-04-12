import { PlaywrightCrawler } from 'apify';
import { load } from 'cheerio';
import { gotScraping } from 'got-scraping';
import { RequestContext } from './common/types';
import RequestMeta from './request-meta';

export default class Crawler extends PlaywrightCrawler {
    override async _handleNavigation(crawlingContext: RequestContext) {
        const meta = new RequestMeta().from(crawlingContext);
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
            }
        } catch (error) {
            this._handleNavigationTimeout(crawlingContext, error as any);
            throw error;
        }

        await this._executeHooks(this.postNavigationHooks, crawlingContext, gotoOptions);
    }
}
