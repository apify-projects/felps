import { Flows, Models, Steps, Hooks, GenerateStepApi } from 'felps';

const STEPS = {
    COLLECT_NEW_PRODUCTS_LISTING: 'COLLECT_NEW_PRODUCTS_LISTING',
    COLLECT_PRODUCT_DETAILS: 'COLLECT_PRODUCT_DETAILS',
};

const FLOWS = {
    COLLECT_NEW_ARRIVALS: 'COLLECT_NEW_ARRIVALS',
}

const MODELS = {
    PRODUCT: 'PRODUCT',
}

// Types
type StepNames = typeof STEPS;
type FlowNames = typeof FLOWS;

type ModelSchemas = {
    PRODUCT: {
        name: string,
        description?: string,
        priceInCents?: number,
    },
}

type GeneralStepApi = GenerateStepApi<FlowNames, StepNames, ModelSchemas>;

const models = Models.create<ModelSchemas>({ names: Object.values(MODELS) });

models.PRODUCT.schema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        priceInCents: { type: 'number' },
    },
};

const steps = Steps.create<StepNames, GeneralStepApi>({ names: Object.values(STEPS) });

const flows = Flows.create<FlowNames>({ names: Object.values(FLOWS) });

flows.COLLECT_NEW_ARRIVALS.steps = [
    steps.COLLECT_NEW_PRODUCTS_LISTING,
    steps.COLLECT_PRODUCT_DETAILS,
];

const hooks = Hooks.create();
hooks.ACTOR_STARTED.handler = async () => {
    console.log('ACTOR_STARTED');
}

export { steps, flows, models, hooks };
