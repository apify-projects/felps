import MultiCrawler from '@usefelps/multi-crawler';
import Actor from '@usefelps/actor';
import Step from '@usefelps/step';
import Flow from '@usefelps/flow';
import RequestQueue from '@usefelps/request-queue';
import Orchestrator from '@usefelps/orchestrator';
import ContextApi from '@usefelps/context-api';
import * as FT from '@usefelps/types';

(async () => {
    type FlowNames = 'MAIN'

    type StepNames =
        'HANDLE_RESULTS' |
        'HANDLE_PAGE';

    const hooks = Actor.prepareHooks({
        preActorStartedHook: {
            handlers: [
                async (_, api) => {
                    console.log('preActorStartedHook');
                    api.start('MAIN', { url: 'https://www.icann.org/' });

                    await Orchestrator.run(Orchestrator.create(api.currentActor()), {} as FT.ReallyAny, ContextApi.create(api.currentActor())({} as FT.ReallyAny));
                }
            ],
            async onErrorHook(error) {
                console.log(error)
            }
        }
    });

    const queues = {
        default: RequestQueue.create()
    }

    const steps = {
        HANDLE_RESULTS: Step.create<StepNames>({
            name: 'HANDLE_RESULTS',
            hooks: {
                navigationHook: {
                    handlers: [
                        async ({ $ }) => {
                            console.log($('title').text())
                        }
                    ]
                }

            }
        })
    };

    const flows = {
        MAIN: Flow.create<FlowNames, StepNames>({
            name: 'MAIN',
            crawlerMode: 'http',
            steps: [
                'HANDLE_RESULTS'
            ],
        })
    };

    const template = Actor.create({
        name: 'template',
        crawler: MultiCrawler.create(),
        steps,
        flows,
        hooks,
        queues,
    });

    await Actor.run(template, {});
})()
