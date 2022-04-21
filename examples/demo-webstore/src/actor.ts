import { Actor } from 'felps';
import { models, flows, steps, hooks } from './definition';

const SELECT = {
    PRODUCTS: '[class*=ProductCard_root]',
    PRODUCT_NAME: '[class*=ProductCard_name]',
    PRODUCT_PRICE: '[class*=ProductCard_price]',
    PRODUCT_URL: '[class*=ProductCard_price]',
    PRODUCT_DESCRIPTION: '[class*=ProductView_sideba] [class*=Text_body]',
};

steps.COLLECT_NEW_PRODUCTS_LISTING.handler = async ({ $ }, api) => {

    for (const product of $(SELECT.PRODUCTS).slice(0, 3)) {
        const data = {
            name: $(product).find(SELECT.PRODUCT_NAME).first().text(),
            priceInCents: +$(product).find(SELECT.PRODUCT_PRICE).first().text().replace(/[^0-9]/g, ''),
        };
        // console.log(data);
        const productRef = api.set('PRODUCT', data);

        const url = api.absoluteUrl($(product).attr('href'));
        if (url) {
            api.goto('COLLECT_PRODUCT_DETAILS', { url }, productRef);
        }
    }
};

steps.COLLECT_PRODUCT_DETAILS.handler = async ({ $ }, api) => {
    api.update('PRODUCT', {
        description: $(SELECT.PRODUCT_DESCRIPTION).first().text(),
    });
}

const actor = Actor.create({ crawlerMode: 'cheerio', steps, models, flows, hooks })

Actor.run(actor);
