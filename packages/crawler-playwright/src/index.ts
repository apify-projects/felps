import { DirectNavigationOptions, registerUtilsToContext } from '@crawlee/playwright/internals/utils/playwright-utils';
import { RequestCrawlerMode } from '@usefelps/types';
import { gotScraping, Method, OptionsInit, Request as GotRequest, TimeoutError } from 'got-scraping';
import { chromium, firefox, webkit } from 'playwright';
import { BrowserPool, PlaywrightPlugin } from '@crawlee/browser-pool';

export const create = (options) => {

    return {
        pool: new BrowserPool({
            browserPlugins: [
                new PlaywrightPlugin(chromium),
                new PlaywrightPlugin(firefox),
                new PlaywrightPlugin(webkit)],
        })
    }
};
