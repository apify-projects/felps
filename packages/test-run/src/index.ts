import { Actor } from 'apify';
import { RequestQueue } from '@crawlee/core';
import CustomPlaywrightCrawler from '@usefelps/custom--crawler--playwright';

(async () => {
    await Actor.init();

    const requestQueue = await RequestQueue.open();
    await requestQueue.addRequest({
        url: 'https://www.apify.com', userData: {
            // __crawlingOptions: { mode: 'firefox' }
        }
    });

    const crawler = new CustomPlaywrightCrawler({
        requestQueue,
        async requestHandler({ request }) {
            console.log(request);
        },
        async failedRequestHandler(inputs) {
            console.log(inputs);
        }
    });

    await crawler.run();
    await Actor.exit();
})()
