import AIOPlaywright from '@usefelps/crawlee--crawler--aio-playwright';
import Crawler from '@usefelps/crawler';
import * as FT from '@usefelps/types';

export const create = (): FT.CrawlerInstance => {
    return Crawler.create({
        name: 'multi-crawler',
        launcher: AIOPlaywright,
    });
};

export default { create };
