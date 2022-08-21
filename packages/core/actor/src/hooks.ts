import ContextApi from '@usefelps/context-api';
import Hook from '@usefelps/hook';
import InstanceBase from '@usefelps/instance-base';
import Logger from '@usefelps/logger';
import Orchestrator from '@usefelps/orchestrator';
import RequestMeta from '@usefelps/request-meta';
import State from '@usefelps/state';
import Trail from '@usefelps/trail';
import * as FT from '@usefelps/types';
import { ReallyAny } from '@usefelps/types';
import * as utils from '@usefelps/utils';
import { getStep } from '.';

export const prepareHooks = <
    ITCrawler extends FT.CrawlerInstance = FT.ReallyAny,
    ITStores extends Record<string, FT.AnyStoreLike> = Record<string, FT.AnyStoreLike>,
    ITQueues extends Record<string, FT.RequestQueueInstance> = Record<string, FT.RequestQueueInstance>,
    ITDatasets extends Record<string, FT.DatasetInstance> = Record<string, FT.DatasetInstance>,
    ITFlows extends Record<string, FT.FlowInstance> = Record<string, FT.FlowInstance>,
    ITSteps extends Record<string, FT.StepInstance> = Record<string, FT.StepInstance>,
    ITContextApi extends FT.TContextApi = FT.TContextApi,
    LocalActorInstance extends FT.ActorInstance<
        ITCrawler,
        ITStores,
        ITQueues,
        ITDatasets,
        ITFlows,
        ITSteps,
        ITContextApi
    > = FT.ActorInstance<
        ITCrawler,
        ITStores,
        ITQueues,
        ITDatasets,
        ITFlows,
        ITSteps,
        ITContextApi
    >
>(hooks: FT.ActorOptions<
    ITCrawler,
    ITStores,
    ITQueues,
    ITDatasets,
    ITFlows,
    ITSteps,
    ITContextApi
>['hooks']) =>
    (initialActor: Partial<FT.ActorInstance>): FT.ActorHooks<
        ITCrawler,
        ITStores,
        ITQueues,
        ITDatasets,
        ITFlows,
        ITSteps,
        ITContextApi,
        LocalActorInstance
    > => {

        const base = InstanceBase.create({ key: 'actor-hooks', name: initialActor.name });
        const validationHandler = async (actor?: LocalActorInstance) => {
            return actor.name === base.name
        };

        return {
            preStartedHook: Hook.create<[actor?: LocalActorInstance, api?: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preStartedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.preStartedHook?.handlers || []),
                    async function ORCHESTRATE(actor) {
                        await Orchestrator.run(Orchestrator.create(actor as FT.ReallyAny), {} as FT.ReallyAny, {});
                    },
                ],
                onErrorHook: hooks?.preStartedHook?.onErrorHook,
            }),
            preEndedHook: Hook.create<[actor: LocalActorInstance, api?: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preEndedHook'),
                validationHandler,
                handlers: [
                    async function PERSIST_STATES(actor) {
                        for (const store of Object.values(actor.stores)) {
                            if (store.type === 'state') {
                                await State.persist(store);
                            }
                        }
                    },
                    ...(hooks?.preEndedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preEndedHook?.onErrorHook,
            }),

            preCrawlerStartedHook: Hook.create<[actor?: LocalActorInstance, api?: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preCrawlerStartedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.preCrawlerStartedHook?.handlers || []),
                    async function ORCHESTRATE(actor) {
                        await Orchestrator.run(Orchestrator.create(actor as FT.ReallyAny), {} as FT.ReallyAny, {});
                    },
                ],
                onErrorHook: hooks?.preCrawlerStartedHook?.onErrorHook,
            }),

            postCrawlerEndedHook: Hook.create<[actor: LocalActorInstance, api?: FT.TContextApi]>({
                name: utils.pathify(base.name, 'postCrawlerEndedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postCrawlerEndedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postCrawlerEndedHook?.onErrorHook,
            }),

            preCrawlerFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'postCrawlerFailedHook'),
                validationHandler,
                handlers: [
                    async function LOGGING(actor, error) {
                        Logger.error(Logger.create(actor), `Actor ${actor.name} failed`, { error } as FT.ReallyAny);
                    },
                    ...(hooks?.preCrawlerFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preCrawlerFailedHook?.onErrorHook,
            }),

            postCrawlerFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'postCrawlerFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postCrawlerFailedHook?.handlers || [
                        async (_, error) => { throw error; }
                    ]),
                ],
                onErrorHook: hooks?.postCrawlerFailedHook?.onErrorHook,
            }),

            preQueueStartedHook: Hook.create<[actor: LocalActorInstance]>({
                name: utils.pathify(base.name, 'preQueueStartedHook'),
                validationHandler,
                handlers: [
                    async function LOAD_QUEUES() {
                        // actor
                        // actor.queues = await QueueCollection.load(actor?.queues as FT.QueueCollectionInstance<FT.ReallyAny>);
                    },
                    ...(hooks?.preQueueStartedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preQueueStartedHook?.onErrorHook,
            }),

            postQueueEndedHook: Hook.create<[actor: LocalActorInstance]>({
                name: utils.pathify(base.name, 'postQueueEndedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postQueueEndedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postQueueEndedHook?.onErrorHook,
            }),

            preFlowStartedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preFlowStartedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.preFlowStartedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preFlowStartedHook?.onErrorHook,
            }),

            postFlowEndedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi]>({
                name: utils.pathify(base.name, 'postFlowEndedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postFlowEndedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postFlowEndedHook?.onErrorHook,
            }),

            postFlowFailedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi]>({
                name: utils.pathify(base.name, 'postFlowFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postFlowFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postFlowFailedHook?.onErrorHook,
            }),

            preStepStartedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preStepStartedHook'),
                validationHandler,
                handlers: [
                    async function CHECK_FLOW_STOPPED(actor, context, api) {
                        const trail = Trail.createFrom(context?.request, { state: actor?.stores?.trails as FT.StateInstance });

                        // Stop the step if the trail is already stopped
                        if (Trail.get(trail).status === 'STOPPED') api.stop();
                    },
                    ...(hooks?.preStepStartedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preStepStartedHook?.onErrorHook,
            }),

            postStepEndedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi]>({
                name: utils.pathify(base.name, 'postStepEndedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postStepEndedHook?.handlers || []),
                    async function ORCHESTRATE(actor, context) {
                        const contextApi = ContextApi.create(actor as FT.ReallyAny);
                        await Orchestrator.run(Orchestrator.create(actor as FT.ReallyAny), context as FT.ReallyAny, contextApi(context as FT.ReallyAny));
                    },
                ],
                onErrorHook: hooks?.postStepEndedHook?.onErrorHook,
            }),

            preStepMainHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preStepMainHook'),
                handlers: [
                    ...(hooks?.preStepMainHook?.handlers || []),
                ],
                onErrorHook: hooks?.preStepMainHook?.onErrorHook,
            }),

            postStepMainHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi]>({
                name: utils.pathify(base.name, 'postStepMainHook'),
                handlers: [
                    ...(hooks?.postStepMainHook?.handlers || []),
                ],
                onErrorHook: hooks?.postStepMainHook?.onErrorHook,
            }),

            preNavigationHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi, goToOptions: Record<PropertyKey, any>]>({
                name: utils.pathify(base.name, 'preNavigationHook'),
                handlers: [
                    async function PRE_NAVIGATION_STEP(actor, context, api, goToOptions) {
                        await Hook.run(api.getStep()?.hooks?.preNavigationHook, actor as unknown as FT.ActorInstance, context as FT.RequestContext, api, goToOptions);
                    },
                    async function ROUTE_INTERCEPTION(actor, context, api) {
                        await context?.page?.route('**', async (route, request) => {
                            const proxiedRoute = new Proxy(route, {
                                get: (target, prop) => {

                                    if (typeof target[prop] === 'function') {
                                        return async (...args) => {
                                            try {
                                                await target[prop](...args);
                                            } catch (error) {
                                                const message = (error as any).message;
                                                if (message.includes('Route') && message.includes('handled')) {
                                                    // console.log('Caught Route is already handled!');
                                                } else {
                                                    throw error;
                                                }
                                            }
                                        }
                                    }

                                    return target[prop];
                                }
                            });

                            await Hook.run(actor?.hooks?.routeInterceptionHook, actor as FT.ReallyAny, context as FT.RequestContext, proxiedRoute, request, api);

                            await Hook.run(api.getFlow()?.hooks?.routeInterceptionHook, context as FT.RequestContext, proxiedRoute, request, api, actor as FT.ReallyAny);

                            await Hook.run(api.getStep()?.hooks?.routeInterceptionHook, context as FT.RequestContext, proxiedRoute, request, api, actor as FT.ReallyAny);

                            await proxiedRoute.continue();

                        });
                    },
                    async function RESPONSE_RECEIVED(actor, context, api) {
                        context?.page?.on?.('requestfinished', async (request) => {
                            await Hook.run(actor?.hooks?.postRequestFinishedHook, actor as FT.ReallyAny, context as FT.RequestContext, request, api);

                            await Hook.run(api.getFlow()?.hooks?.postRequestFinishedHook, context as FT.RequestContext, request, api, actor as FT.ReallyAny);

                            await Hook.run(api.getStep()?.hooks?.postRequestFinishedHook, context as FT.RequestContext, request, api, actor as FT.ReallyAny);
                        });
                    },
                    // async function CONSOLE_FIRED(actor, context, api) {
                    //     context?.page?.on?.('console', async (response) => {
                    //         await Hook.run(actor?.hooks?.postRequestFinishedHook, actor as FT.ReallyAny, context as FT.RequestContext, response);

                    //         await Hook.run(api.getFlow()?.hooks?.postRequestFinishedHook, context as FT.RequestContext, response, actor as FT.ReallyAny);

                    //         await Hook.run(api.getStep()?.hooks?.postRequestFinishedHook, context as FT.RequestContext, response, actor as FT.ReallyAny);
                    //     });
                    // },
                    async function INJECTING_SCRIPTS(actor, context, api) {
                        if (context?.page) {
                            const promises = [];

                            for (const browser of context.browserController.browser.contexts()) {
                                promises.push(
                                    (async () => {
                                        const inject = browser.addInitScript.bind(browser);

                                        await Hook.run(actor?.hooks?.preAnyPageOpenedScriptInjection, actor as FT.ReallyAny, inject);

                                        await Hook.run(api.getFlow()?.hooks?.preAnyPageOpenedScriptInjection, inject, actor as FT.ReallyAny);

                                        await Hook.run(api.getStep()?.hooks?.preAnyPageOpenedScriptInjection, inject, actor as FT.ReallyAny);
                                    })()
                                );
                            }

                            await Promise.all(promises);

                            const inject = context.page.addInitScript.bind(context.page);

                            await Hook.run(actor?.hooks?.prePageOpenedScriptInjection, actor as FT.ReallyAny, inject);

                            await Hook.run(api.getFlow()?.hooks?.prePageOpenedScriptInjection, inject, actor as FT.ReallyAny);

                            await Hook.run(api.getStep()?.hooks?.prePageOpenedScriptInjection, inject, actor as FT.ReallyAny);
                        }

                    },
                    ...(hooks?.preNavigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.preNavigationHook?.onErrorHook,
            }),

            postNavigationHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi, goToOptions: Record<PropertyKey, any>]>({
                name: utils.pathify(base.name, 'postNavigationHook'),
                handlers: [
                    async function POST_NAVIGATION_STEP(actor, context, api, goToOptions) {
                        const meta = RequestMeta.create(context as FT.RequestContext);
                        const step = getStep(actor as FT.MaybeAny, meta.data.actorName, meta.data.stepName);

                        await Hook.run(step?.hooks?.postNavigationHook, actor as unknown as FT.ActorInstance, context as FT.RequestContext, api, goToOptions);
                    },
                    ...(hooks?.postNavigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.postNavigationHook?.onErrorHook,
            }),

            preStepFailedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'preStepFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.preStepFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preStepFailedHook?.onErrorHook,
            }),

            postStepRequestFailedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'postStepRequestFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postStepRequestFailedHook?.handlers || []),
                    async function ORCHESTRATE(actor, context) {
                        const contextApi = ContextApi.create(actor as FT.ReallyAny);
                        await Orchestrator.run(Orchestrator.create(actor as FT.ReallyAny), context as FT.ReallyAny, contextApi(context as FT.ReallyAny));
                    },
                ],
                onErrorHook: hooks?.postStepRequestFailedHook?.onErrorHook,
            }),

            postFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'postFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postFailedHook?.onErrorHook,
            }),

            preBlackoutHook: Hook.create<[actor: LocalActorInstance, evt: ReallyAny]>({
                name: utils.pathify(base.name, 'preBlackoutHook'),
                handlers: [
                    async function LOGGING(actor, evt) {
                        Logger.error(Logger.create(actor), `Actor ${actor.name} is now blacking out`, { evt } as FT.ReallyAny);
                    },
                    ...(hooks?.preBlackoutHook?.handlers || []),
                ],
                onErrorHook: hooks?.preBlackoutHook?.onErrorHook,
            }),

            routeInterceptionHook: Hook.create({
                name: utils.pathify(base.name, 'routeInterceptionHook'),
                handlers: [
                    ...(hooks?.routeInterceptionHook?.handlers || []),
                ],
                onErrorHook: hooks?.routeInterceptionHook?.onErrorHook,
            }),

            postRequestFinishedHook: Hook.create({
                name: utils.pathify(base.name, 'postRequestFinishedHook'),
                handlers: [
                    ...(hooks?.postRequestFinishedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postRequestFinishedHook?.onErrorHook,
            }),

            prePageOpenedScriptInjection: Hook.create({
                name: utils.pathify(base.name, 'prePageOpenedScriptInjection'),
                handlers: [
                    ...(hooks?.prePageOpenedScriptInjection?.handlers || []),
                ],
                onErrorHook: hooks?.prePageOpenedScriptInjection?.onErrorHook,
            }),

            preAnyPageOpenedScriptInjection: Hook.create({
                name: utils.pathify(base.name, 'preAnyPageOpenedScriptInjection'),
                handlers: [
                    ...(hooks?.preAnyPageOpenedScriptInjection?.handlers || []),
                ],
                onErrorHook: hooks?.preAnyPageOpenedScriptInjection?.onErrorHook,
            }),
        }
    }
