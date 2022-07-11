import Actor from '@usefelps/actor';
import Flow from '@usefelps/flow';
import MultiCrawler from '@usefelps/multi-crawler';
import Orchestrator from '@usefelps/orchestrator';
import Step from '@usefelps/step';
import * as utils from '@usefelps/utils';
import { ReallyAny } from '@usefelps/types';
import { ProxyConfiguration } from 'apify';

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
                    await Orchestrator.run(Orchestrator.create(api.currentActor()), {} as ReallyAny, {});
                }
            ],
            async onErrorHook(error) {
                console.log(error)
            }
        }
    });

    const steps = utils.arrayToKeyedObject([
        Step.create<StepNames>({
            name: 'HANDLE_RESULTS',
            hooks: {
                navigationHook: {
                    handlers: [
                        async (_, api) => {
                            api.next('HANDLE_PAGE', { url: 'https://www.icann.org/get-started' });
                        }
                    ]
                }

            }
        }),
        Step.create<StepNames>({
            name: 'HANDLE_PAGE',
            hooks: {
                navigationHook: {
                    handlers: [
                        async ({ $ }) => {
                            console.log($('title').text())
                        }
                    ]
                }

            }
        }),
    ], 'name');


    const flows = utils.arrayToKeyedObject([
        Flow.create<FlowNames, StepNames>({
            name: 'MAIN',
            crawlerMode: 'chromium',
            steps: [
                'HANDLE_RESULTS',
                'HANDLE_PAGE'
            ],
        }),
    ], 'name');

    const template = Actor.create({
        name: 'template',
        crawler: MultiCrawler.create({
            proxyConfiguration: new ProxyConfiguration({
                apifyProxyGroups: ['SHADER']
            })
        }),
        steps,
        flows,
        hooks,
    });

    await Actor.run(template, {});
})()
