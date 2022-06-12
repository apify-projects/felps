import { RequestQueue } from '@crawlee/core';
import CustomPlaywrightCrawler from '@usefelps/custom--crawler--playwright';

async function main() {
    const requestQueue = await RequestQueue.open();
    await requestQueue.addRequest({ url: 'https://www.iana.org' });

    const crawler = new CustomPlaywrightCrawler({
        requestQueue,
        async requestHandler({ request }) {
            console.log(request);
        }
    });

    await crawler.run();
}

main()
