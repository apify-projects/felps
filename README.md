![Felps](./media/header.jpg)


# Get started

## Define your crawler template
```ts
import { Flows, Models, Steps, Hooks } from 'felps';

// 1. Define the data models (generating typescript types and validating data)
const MODELS = Models.define({
    PRODUCT: {
        schema: <const>{
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                priceInCents: { type: 'number' },
            },
            required: ['name'],
            additionalProperties: false,
        }
    }
});

// 2. Define all the available steps
const STEPS = Steps.define({
    COLLECT_NEW_PRODUCTS_LISTING: null,
    COLLECT_PRODUCT_DETAILS: null,
});

// 3. Define all the available flows using previously defined steps
const FLOWS = Flows.use({ STEPS }).define({
    COLLECT_NEW_PRODUCTS: {
        steps: [
            'COLLECT_NEW_PRODUCTS_LISTING',
            'COLLECT_PRODUCT_DETAILS',
        ],
        output: MODELS.PRODUCT.schema,
    }
});

// 4. Instantiate it all
 const models = Models.create({ MODELS });
 const steps = Steps.create({ MODELS, STEPS, FLOWS });
 const flows = Flows.create({ FLOWS });

// 5. Define your hooks
const hooks = Hooks.create({ MODELS, STEPS, FLOWS });

// 5.a Set up how you want to start your actor (based on the input)
hooks.ACTOR_STARTED.handler = async (_, api) => {
    const { url } = api.getActorInput();

    api.start('COLLECT_NEW_PRODUCTS', { url }, { flow, url });
}

export { models, steps, flows, hooks };
```

## Use your crawler
```ts
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

        const productRef = api.set('PRODUCT', {
            name: $(product).find(SELECT.PRODUCT_NAME).first().text(),
            priceInCents: +$(product).find(SELECT.PRODUCT_PRICE).first().text().replace(/[^0-9]/g, ''),
        });


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

const actor = Actor.create({ steps, models, flows, hooks });

Actor.run(actor);
```
