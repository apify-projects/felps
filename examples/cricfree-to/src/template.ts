import { Flows, Models, Steps, Hooks } from 'felps';
import { DISCOVER_LIVE_EVENTS_URL } from './consts';

const MODELS = Models.define({
    LIVE_EVENT: {
        schema: <const>{
            type: 'object',
            properties: {
                title: { type: 'string' },
                date: { type: 'string' },
                url: { type: 'string' },
            },
            required: ['title', 'url'],
            additionalProperties: false,
        }
    },
    STREAM: {
        schema: <const>{
            type: 'object',
            properties: {
                url: { type: 'string' },
            },
            additionalProperties: false,
        }
    }
});

const STEPS = Steps.define({
    COLLECT_LIVE_EVENTS_LISTING: null,
    COLLECT_LIVE_EVENT: null,
});

const models = Models.create({ MODELS });

const FLOWS = Flows.use({ STEPS }).define({
    DISCOVER_LIVE_EVENTS: {
        steps: ['COLLECT_LIVE_EVENTS_LISTING', 'COLLECT_LIVE_EVENT'],
        output: {
            schema: <const>{
                type: 'array',
                items: {
                    ...MODELS.LIVE_EVENT.schema,
                    properties: {
                        ...MODELS.LIVE_EVENT.schema.properties,
                        streams: {
                            type: 'array',
                            items: MODELS.STREAM.schema,
                            async organize(items) {
                                return items.slice(0, 1);
                            },
                            async limit(items) {
                                return items.length > 3
                            },
                        }
                    },
                },
                async organize(items) {
                    return items.slice(0, 1);
                },
                async limit(items) {
                    return items.length > 3
                }
            }
        },
    }
});


const steps = Steps.create({ MODELS, STEPS, FLOWS });

const flows = Flows.create({ FLOWS });

const hooks = Hooks.create({ MODELS, STEPS, FLOWS });

hooks.ACTOR_STARTED.handler = async (_, api) => {
    const { title } = api.getActorInput();
    api.start('DISCOVER_LIVE_EVENTS', { url: DISCOVER_LIVE_EVENTS_URL }, { title });
}

export { models, steps, flows, hooks };
