import Actor from '@usefelps/actor';
import Step from '@usefelps/step';
import Flow from '@usefelps/flow';

(async () => {
    type FlowNames = 'INDEXER' | 'HOST_URL_FINDER'

    type StepNames =
        'HANDLE_SEARCH_RESULTS' |
        'HANDLE_RESULT_PAGE' |
        'HANDLE_HOSTING_URLS' |
        'HANDLE_HOSTING_URL_PAGE' |
        'HANDLE_PAGE' |
        'HANDLE_SEASON' |
        'HANDLE_EPISODE' |
        'HANDLE_EPISODE_HOSTING_URLS';


    const hooks = Actor.createHooks({

    });

    const steps = [
        Step.create<StepNames>({
            name: 'HANDLE_PAGE',
            hooks: {
                navigationHook: {
                    handlers: [
                        // async (context, api) => {

                        // }
                    ]
                }

            }
        })
    ];

    const flows = [
        Flow.create<FlowNames, StepNames>({
            name: 'INDEXER',
            steps: [
                'HANDLE_HOSTING_URLS'
            ],
        })
    ];

    const template = Actor.create({
        name: 'template',
        steps,
        flows,
        hooks,
    });

    await Actor.run(template, {});
})()
