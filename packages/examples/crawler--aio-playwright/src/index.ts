import { RequestQueue } from '@crawlee/core';
import AIOPlaywrightCrawler from '@usefelps/crawlee--crawler--aio-playwright';
import * as FT from '@usefelps/types';
import { Actor } from 'apify';

(async () => {
    await Actor.init();

    const requestQueue = await RequestQueue.open();

    await requestQueue.addRequests([
        {
            url: 'https://www.apify.com',
            uniqueKey: '1',
            userData: {
                __crawlerOptions: { mode: 'http' }
            }
        },
        {
            url: 'https://www.apify.com',
            uniqueKey: '2',
            userData: {
                __crawlerOptions: { mode: 'chromium' }
            }
        },
        {
            url: 'https://www.apify.com',
            uniqueKey: '3',
            userData: {
                __crawlerOptions: { mode: 'firefox' }
            }
        },
        {
            url: 'https://www.apify.com',
            uniqueKey: '4',
            userData: {
                __crawlerOptions: { mode: 'webkit' }
            }
        }
    ]);

    const crawler = new AIOPlaywrightCrawler({
        requestQueue,
        async requestHandler({ request, $ }) {
            console.log(`Processing request via ${(request.userData as FT.ReallyAny).__crawlerOptions.mode} mode`);
            Actor.pushData({
                url: request.url,
                title: ($ as FT.ReallyAny)('title').first().text(),
                mode: (request.userData as FT.ReallyAny).__crawlerOptions.mode,
            })
        }
    });

    await crawler.run();
    await Actor.exit();
})()
