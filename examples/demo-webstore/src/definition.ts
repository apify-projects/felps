import { Flows, Models, Steps } from 'felps';

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
        }
    }
});

const models = Models.create({ MODELS });

const STEPS = Steps.define({
    COLLECT_NEW_PRODUCTS_LISTING: null,
    COLLECT_PRODUCT_DETAILS: {
        crawlerMode: 'browser',
    },
})

const FLOWS = Flows.use({ STEPS }).define(
    {
        COLLECT_NEW_ARRIVALS: {
            crawlerMode: 'ajax',
            steps: [
                'COLLECT_NEW_PRODUCTS_LISTING',
                'COLLECT_PRODUCT_DETAILS',
            ],
            output: models.PRODUCT.schema,
        }
    });


const steps = Steps.create({ MODELS, STEPS, FLOWS });

steps.COLLECT_NEW_PRODUCTS_LISTING.handler = async (context, api) => {
    api.goto('')
}

const flows = Flows.create({ FLOWS });

// const hooks = Hooks.create();
// hooks.ACTOR_STARTED.handler = async (_, api) => {
//     const { flow, url } = api.getInput();
//     api.start('COLLECT_NEW_ARRIVALS', { url }, { flow, url });
// }

export default { models, flows, steps };
