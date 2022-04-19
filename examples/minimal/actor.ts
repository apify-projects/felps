import { Flows, Models, Steps } from '../../src';
import { GenerateStepApi } from '../../src/common/types';

const STEPS = {
    COLLECT_TV_SHOW_LISTING: 'COLLECT_TV_SHOW_LISTING',
    COLLECT_TV_SHOW: 'COLLECT_TV_SHOW',
    COLLECT_SEASON: 'COLLECT_SEASON',
    COLLECT_EPISODE: 'COLLECT_EPISODE',
};

const FLOWS = {
    DISCOVER_TV_SHOW: 'DISCOVER_TV_SHOW',
    DISCOVER_EPISODE: 'DISCOVER_EPISODE',
}

const MODELS = {
    TV_SHOW: 'TV_SHOW',
    TV_SHOW_EPISODE: 'TV_SHOW_EPISODE',
}

// Types
type StepNames = typeof STEPS;
type FlowNames = typeof FLOWS;

// type FlowsDefinitions = {
//     DISCOVER_TV_SHOW: ['COLLECT_TV_SHOW_LISTING', 'COLLECT_TV_SHOW'],
// }

type ModelSchemas = {
    TV_SHOW: {
        title: string,
        seasons?: ModelSchemas['SEASON'][]
    },
    SEASON: {
        title?: string,
        number: number,
        episodes?: ModelSchemas['EPISODE'][]
    },
    EPISODE: {
        number: number,
        title?: string,
    }
}

type GeneralStepApi = GenerateStepApi<FlowNames, StepNames, ModelSchemas>;

type CustomStepApi = {
    COLLECT_TV_SHOW_LISTING: {
        isCool(): boolean
    }
};

export const models = Models.create<ModelSchemas>({ names: Object.values(MODELS) });

models.EPISODE.schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
    },
};

models.SEASON.schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        episodes: { type: 'array', items: models.EPISODE.schema },
    },
};


models.TV_SHOW.schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        seasons: {
            type: 'array',
            items: models.SEASON.schema
        }
    },
}

export const steps = Steps.create<StepNames, GeneralStepApi, CustomStepApi>({ names: Object.values(STEPS) });


export const flows = Flows.create<FlowNames>({ names: Object.values(FLOWS) });

flows.discoverTvShow.steps = [
    steps.collectTvShowListing,
    steps.collectTvShow,
];
