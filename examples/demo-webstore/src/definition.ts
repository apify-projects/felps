import { Flows, Models, Steps } from 'felps';

const MODELS = Models.define({
    PRODUCT: {
        schema: <const>{
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                priceInCents: { type: 'number' },
                foo: { type: 'string' },
            },
            required: ['name'],
            additionalProperties: false,
        }
    }
});

const STEPS = Steps.define({
    COLLECT_NEW_PRODUCTS_LISTING: null,
    COLLECT_PRODUCT_DETAILS: null,
})

const FLOWS = Flows.use({ STEPS }).define(
    {
        COLLECT_NEW_ARRIVALS: {
            crawlerMode: 'ajax',
            steps: [
                'COLLECT_NEW_PRODUCTS_LISTING',
                'COLLECT_PRODUCT_DETAILS',
            ],
            output: MODELS.PRODUCT.schema,
        }
    });


const models = Models.create({ MODELS });
const steps = Steps.create({ MODELS, STEPS, FLOWS });
const flows = Flows.create({ FLOWS });

export default { models, steps, flows };
