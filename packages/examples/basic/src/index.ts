import Actor from '@usefelps/actor';
import Flow from '@usefelps/flow';
import MultiCrawler from '@usefelps/multi-crawler';
import Orchestrator from '@usefelps/orchestrator';
import Step from '@usefelps/step';
import { ReallyAny } from '@usefelps/types';
import * as utils from '@usefelps/utils';
import { ProxyConfiguration } from 'apify';
import { make, write, Patches, read } from 'cagibi';

(async () => {
    type FlowNames = 'MAIN'

    type StepNames =
        'HANDLE_RESULTS' |
        'HANDLE_PAGE';

    // type CrawlType = {
    //     url: string;
    //     results: { title: string }[]
    // }

    // type StateItems = { crawl: CrawlType };

    const patches = new Patches();

    // const readState = (context: RequestContext): StateItems => {
    //     const { userData } = context.request;

    //     return {
    //         crawl: read<CrawlType>(userData?.crawl),
    //     };
    // };

    const hooks = Actor.prepareHooks({
        preActorStartedHook: {
            handlers: [
                async (_, api) => {
                    const crawl = make({ url: 'https://www.icann.org/', results: [] });
                    patches.add(crawl);
                    api.start('MAIN', { url: crawl.url, userData: { results: write(crawl.results) } });
                    await Orchestrator.run(Orchestrator.create(api.currentActor()), {} as ReallyAny, {});
                }
            ],
            async onErrorHook(error) {
                console.log(error)
            }
        },
        postFlowEndedHook: {
            handlers: [
                async () => {
                    try {
                        console.log({ patches: patches.map(read) })
                        console.log('postFlowEndedHook', patches.stitch())
                    } catch (error) {
                        console.log(error)
                    }
                }
            ]
        }
    });

    const steps = utils.arrayToKeyedObject([
        Step.create<StepNames>({
            name: 'HANDLE_RESULTS',
            hooks: {
                navigationHook: {
                    handlers: [
                        async (context, api) => {
                            const { $, request: { userData } } = context;
                            patches.add(make({ title: $('title').text() }, userData.results));
                            api.next('HANDLE_PAGE', { url: 'https://www.icann.org/get-started', userData });
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
                        async (context) => {
                            const { $, request: { userData } } = context;
                            patches.add(make({ title: $('title').text() }, userData.results));
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
