import { Flows, Models, Steps, Hooks } from 'felps';

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

const STEPS = Steps.define({
    COLLECT_NEW_PRODUCTS_LISTING: null,
    COLLECT_PRODUCT_DETAILS: null,
    OTHER: null,
});

const FLOWS = Flows.use({ STEPS }).define({
    COLLECT_NEW_ARRIVALS: {
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

const hooks = Hooks.create({ MODELS, STEPS, FLOWS });

hooks.ACTOR_STARTED.handler = async (_, api) => {
    const { flow, url } = api.getInput();
    api.start(flow, { url }, { flow, url });
}

export { models, steps, flows, hooks };
