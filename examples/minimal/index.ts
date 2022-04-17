import { Actor } from '../../src';
import { models, flows, steps } from './actor';

steps.collectTvShowListing.handler = async ({ $ }, api) => {
    for (const tvShowElement of $('#tv-show')) {
        const tvShowRef = api.addTvShow({ title: tvShowElement.text() });
        api.goCollectTvShow({ url: tvShowElement.attr('href') }, tvShowRef);
    }
};

steps.collectTvShow.handler = async ({ $ }, api) => {
    for (const seasonElement of $('#seasons')) {
        const seasonRef = api.addSeason({ number: +seasonElement.text() });
        api.goCollectSeason({ url: seasonElement.attr('href') }, seasonRef);
    }
}

steps.collectSeason.handler = async ({ $ }, api) => {
    for (const episodeElement of $('#episodes')) {
        api.addEpisode({ number: +episodeElement.text() });
    }
}


const actor = Actor.create({ steps: steps as any, models, flows })

Actor.run(actor);
