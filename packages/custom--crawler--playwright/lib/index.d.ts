import { BrowserCrawler, BrowserPlugin, PlaywrightCrawlerOptions, PlaywrightLaunchContext } from 'apify';
import EventEmitter from 'eventemitter3';
export default class MultiCrawler extends BrowserCrawler {
    browserPlugins: {
        [browser: string]: BrowserPlugin;
    };
    crawlerModePath: string;
    events: EventEmitter;
    static optionsShape: any;
    launchContext: PlaywrightLaunchContext;
    constructor(options: PlaywrightCrawlerOptions);
    _navigationHandler(context: any, nextOptions: any): Promise<any>;
    _handleRequestFunction(context: any): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map