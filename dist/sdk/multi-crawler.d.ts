import { BrowserCrawler, PlaywrightCrawlerOptions, PlaywrightLaunchContext } from 'apify';
import { ReallyAny } from '../types';
export declare type MultiCrawlerOptions = PlaywrightCrawlerOptions & {
    launchContext: PlaywrightLaunchContext;
};
export default class MultiCrawler extends BrowserCrawler {
    static optionsShape: any;
    launchContext: PlaywrightLaunchContext;
    constructor(options: MultiCrawlerOptions);
    _navigationHandler(context: ReallyAny, nextOptions: ReallyAny): Promise<any>;
    _handleRequestFunction(context: ReallyAny): Promise<void>;
}
//# sourceMappingURL=multi-crawler.d.ts.map