import { Actor } from 'felps';
import { SELECT } from './consts';
import { flows, hooks, models, steps } from './template';
import { findVariable } from './utils';

steps.COLLECT_LIVE_EVENTS_LISTING.handler = async ({ $, request }, api) => {
    const script = $(SELECT.LIVE_EVENTS_SCRIPT).first().html();
    const liveEvents: { match: string, date: string }[] = findVariable(script, 'ev_arr');

    for (const liveEvent of liveEvents.slice(0, 20)) {
        // if (liveEvent.match.toLowerCase().trim() === api.getFlowInput().title.toLowerCase().trim()) {
        const liveEventRef = api.add('LIVE_EVENT', {
            title: liveEvent.match,
            date: liveEvent.date,
            url: request.url,
        });

        api.goto('COLLECT_LIVE_EVENT', { url: 'http://google.com' }, liveEventRef);
        // }
    }
}

steps.COLLECT_LIVE_EVENT.handler = async (_, api) => {
    api.update('LIVE_EVENT', {
        title: 'changed title'
    })
}

const actor = Actor.create({ steps, models, flows, hooks });

Actor.run(actor);
