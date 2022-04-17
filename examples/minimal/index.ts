import { Actor } from '../../src';
import { models, flows, steps } from './actor';

steps.collectTvShowListing.handler = async ({ $ }, api) => {
    for (const tvShowElement of $('#tv-show')) {
        const tvShowRef = api.set('TV_SHOW', { title: tvShowElement.text() });
        api.go('COLLECT_TV_SHOW', { url: tvShowElement.attr('href') }, tvShowRef);

        // custom API only available in this step
        api.isCool();
    }
};

steps.collectTvShow.handler = async ({ $ }, api) => {
    for (const seasonElement of $('#seasons')) {
        const seasonRef = api.set('SEASON', { number: +seasonElement.text() });
        api.go('COLLECT_SEASON', { url: seasonElement.attr('href') }, seasonRef);
    }
}

steps.collectSeason.handler = async ({ $ }, api) => {
    for (const episodeElement of $('#episodes')) {
        api.set('EPISODE', { number: +episodeElement.text() });
    }
}

const actor = Actor.create({ steps: steps as any, models, flows })

Actor.run(actor);
