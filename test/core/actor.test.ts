/* eslint-disable */

import { Actor, Flow, Step, Model, State } from 'felps';

describe('Actor', () => {

    it('should fire a log to a custom transport', async () => {

        const models = {
            ...Model.createKeyed({
                name: 'INPUT',
                schema: <const>{
                    type: 'object',
                    properties: {
                        beautiful: { type: 'boolean' }
                    }
                }
            })
        };

        const steps = {
            ...Step.createKeyed({
                name: 'COLLECT_MOVIES_LIST',
                hooks: {
                    mainHook: {
                        handlers: [
                            async (context) => {
                                const state = State.create<{ deep: { node: { name: string }[] } }>({
                                    name: 'default'
                                });

                                State.push(state, , {});

                                const state = {} as { matches: { name: string }[] };
                                const match = { name: 'odij' };
                                state.matches.push(match);

                                api.next('COLLECT_MOVIES_LIST', { state, statePath:  });
                            },
                        ]
                    }
                }
            }),
            ...Step.createKeyed({
                name: 'COLLECT_MOVIE_DETAILS',
                hooks: {
                    mainHook: {
                        handlers: [
                            async () => { },
                        ]
                    }
                }
            })
        };

        const flows = {
            ...Flow.createKeyed({
                name: 'COLLECT_MOVIES',
                steps: [
                    steps.COLLECT_MOVIES_LIST,
                    steps.COLLECT_MOVIE_DETAILS,
                ],
                input: models.INPUT,
            })
        }

        const stores = {

        }

        const actor = Actor.create({
            name: 'test-actor',
            steps,
            flows,
            models,
        })

        await Actor.run(actor, { test: true });
    });

});
