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

type ModelSchemas = {
    tvShow: {
        title: string,
        seasons?: ModelSchemas['season'][]
    },
    season: {
        title?: string,
        number: number,
        episodes?: ModelSchemas['episode'][]
    },
    episode: {
        number: number,
        title?: string,
    }
}

type GeneralStepApi = GenerateStepApi<FlowNames, StepNames, ModelSchemas>;

export const models = Models.create<ModelSchemas>({ names: Object.values(MODELS) });

models.episode.schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
    },
};

models.season.schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        episodes: { type: 'array', items: models.episode.schema },
    },
};


models.tvShow.schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        seasons: {
            type: 'array',
            items: models.season.schema
        }
    },
}

export const steps = Steps.create<StepNames, GeneralStepApi>({ names: Object.values(STEPS) });


export const flows = Flows.create<FlowNames>({ names: Object.values(FLOWS) });
