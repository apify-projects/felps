import felps from '../src';
import { GenerateModelMethods, GenerateStepMethods, StepBaseApiMethods } from '../src/common/types';

const STEPS = ['COLLECT_MOVIE_LISTING'] as const;
// const FLOWS = ['DISCOVER_MOVIE', 'DISCOVER_EPISODE'] as const;

type StepNames = typeof STEPS[number];
// type StepNames = 'COLLECT_MOVIE_LISTING';
// type FlowNames = typeof FLOWS[number];
type FlowNames = 'DISCOVER_MOVIE' | 'DISCOVER_EPISODE';

type ModelDefinitions = {
  movie: {
    name: string,
    episodes: ModelDefinitions['movieEpisode'][]
  },
  movieEpisode: {
    name: string,
  }
}

type BaseStepApi = StepBaseApiMethods;
type GlobalCustomStepApi = {
  test: () => void;
}
type ModelMethods = GenerateModelMethods<ModelDefinitions>;
type StepMethods = GenerateStepMethods<StepNames, ModelDefinitions>
type GeneralStepApi = BaseStepApi & GlobalCustomStepApi & ModelMethods & StepMethods;
type StepSpecificCustomApi = {
  COLLECT_MOVIE_LISTING: { hi: () => string; };
}

const steps = new felps.Steps<StepNames, GeneralStepApi, StepSpecificCustomApi>({ names: [...STEPS] });
steps.set.collectMovieListing({
  extendStepApi(context, api) {
    return {
      hi: () => {
        console.log('test');
        return 'doewj';
      }
    }
  }
})

steps.on.collectMovieListing(async (context, api) => {

})


steps.on.collectMovieListing()

const flows = new felps.Flows<FlowNames>();
flows.add('DISCOVER_EPISODE', [
  steps.items.COLLECT_MOVIE_LISTING
]);

const models = new felps.Models<ModelDefinitions>();
models.add('movieEpisode', {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  }
});

models.add('movie', {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      episodes: { type: 'array', items: models.items.movieEpisode.schema }
    },
  }
});

const stepCustomApi = new felps.StepCustomApi<GlobalCustomStepApi, GeneralStepApi>({
  extend(context, api) {
    return {
      test() {
        console.log('test');
      }
    }
  }
});

const actor = new felps.Actor({
  steps,
  stepCustomApi,
  flows,
  models,
});

export default actor;