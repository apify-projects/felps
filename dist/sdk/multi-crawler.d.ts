import { BrowserCrawler, BrowserPlugin, PlaywrightCrawlerOptions, PlaywrightLaunchContext } from 'apify';
declare type ReallyAny = any;
export default class MultiCrawler extends BrowserCrawler {
    browserPlugins: {
        [browser: string]: BrowserPlugin;
    };
    crawlerModePath: string;
    static optionsShape: any;
    launchContext: PlaywrightLaunchContext;
    constructor(options: PlaywrightCrawlerOptions);
    _navigationHandler(context: ReallyAny, nextOptions: ReallyAny): Promise<ReallyAny>;
    _handleRequestFunction(context: ReallyAny): Promise<ReallyAny>;
}
export {};
//# sourceMappingURL=multi-crawler.d.ts.map