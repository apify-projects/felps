import * as CONST from '@usefelps/constants';
import ContextApi from '@usefelps/context-api';
import Trail from '@usefelps/trail';
import Crawler from '@usefelps/crawler';
import Hook from '@usefelps/hook';
import InstanceBase from '@usefelps/instance-base';
import Logger from '@usefelps/logger';
import Dataset from '@usefelps/dataset'
import Orchestrator from '@usefelps/orchestrator';
import RequestMeta from '@usefelps/request-meta';
import RequestQueue from '@usefelps/request-queue';
import State from '@usefelps/state';
import Step from '@usefelps/step';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

export const create = <
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
>(options: FT.ActorOptions<
    ITCrawler,
    ITStores,
    ITQueues,
    ITDatasets,
    ITFlows,
    ITSteps,
    ITContextApi
>
): LocalActorInstance => {

    const base = InstanceBase.create({ key: 'actor', name: options.name });

    const extendMetaContext = <T extends Record<string, FT.ReallyAny>>(collection: T, meta: FT.RequestMetaData): T => {
        return Object.keys(collection).reduce<FT.ReallyAny>((acc, key) => {
            const value = collection[key];

            const extended = {
                ...value,
                ...InstanceBase.create({ name: prefix({ name: base.name }, value.name), key: value.key }),
                meta: { ...value.meta, ...meta },
            };

            acc[extended.name] = extended;
            return acc;
        }, {});
    }

    const instance = {
        ...base,

        stores: options?.stores,
        datasets: options?.datasets,
        queues: options?.queues,

        flows: extendMetaContext(options?.flows || {}, { actorName: base.name }),
        steps: extendMetaContext(options?.steps || {}, { actorName: base.name }),

        contextApi: options?.contextApi,

        crawler: options?.crawler,
        crawlerMode: options?.crawlerMode || 'http',
        // crawlerOptions: options?.crawlerOptions,
    };

    return {
        ...instance,
        hooks: typeof options?.hooks === 'function'
            ? options?.hooks(instance)
            : prepareHooks<
                ITCrawler,
                ITStores,
                ITQueues,
                ITDatasets,
                ITFlows,
                ITSteps,
                ITContextApi
            >(options?.hooks)(instance),
    } as LocalActorInstance;
};

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
    (actor: Partial<FT.ActorInstance>): FT.ActorHooks<
        ITCrawler,
        ITStores,
        ITQueues,
        ITDatasets,
        ITFlows,
        ITSteps,
        ITContextApi,
        LocalActorInstance
    > => {

        const base = InstanceBase.create({ key: 'actor-hooks', name: actor.name });
        const validationHandler = async (actor?: LocalActorInstance) => {
            return actor.name === base.name
        };

        return {
            preActorStartedHook: Hook.create<[actor?: LocalActorInstance, api?: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preActorStartedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.preActorStartedHook?.handlers || []),
                    async function ORCHESTRATE(actor) {
                        await Orchestrator.run(Orchestrator.create(actor as FT.ReallyAny), {} as FT.ReallyAny, {});
                    },
                ],
                onErrorHook: hooks?.preActorStartedHook?.onErrorHook,
            }),
            postActorEndedHook: Hook.create<[actor: LocalActorInstance, api?: FT.TContextApi]>({
                name: utils.pathify(base.name, 'postActorEndedHook'),
                validationHandler,
                handlers: [
                    async function CLOSING() {
                        // actor
                        // await StoreCollection.persist(actor.stores);
                    },
                    ...(hooks?.postActorEndedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postActorEndedHook?.onErrorHook,
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

            postCrawlerFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'postCrawlerFailedHook'),
                validationHandler,
                handlers: [
                    async function LOGGING(actor, error) {
                        Logger.error(Logger.create(actor), `Actor ${actor.name} failed`, { error } as FT.ReallyAny);
                    },
                    ...(hooks?.postCrawlerFailedHook?.handlers || []),
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

            preStepStartedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preStepStartedHook'),
                validationHandler,
                handlers: [
                    async function CHECK_FLOW_STOPPED(actor, context, api) {
                        const trails = await State.load(actor?.stores?.trails as FT.StateInstance);
                        const trail = Trail.createFrom(context?.request, { state: trails });

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
                        const meta = RequestMeta.create(context as FT.RequestContext);
                        const step = getStep(actor as FT.MaybeAny, meta.data.actorName, meta.data.stepName);

                        await Hook.run(step?.hooks?.preNavigationHook, actor as unknown as FT.ActorInstance, context as FT.RequestContext, api, goToOptions);
                    },
                    async function RESPONSE_INTERCEPTION(actor, context) {
                        const meta = RequestMeta.create(context as FT.RequestContext);
                        const step = getStep(actor as FT.MaybeAny, meta.data.actorName, meta.data.stepName);

                        context?.page?.on?.('response', async (response) => {
                            await Hook.run(step?.hooks?.responseInterceptionHook, context as FT.RequestContext, response, actor as FT.ReallyAny);
                        });
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

            postStepFailedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext, api: FT.TContextApi, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'postStepFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postStepFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postStepFailedHook?.onErrorHook,
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
        }
    }

export const combine = (actor: FT.ActorInstance, ...actors: FT.ActorInstance[]): FT.ActorInstance => {
    for (const otherActor of actors) {
        actor.flows = { ...actor.flows, ...otherActor.flows };
        actor.steps = { ...actor.steps, ...otherActor.steps };

        //TODO: Change this!
        actor.hooks = {
            ...actor.hooks,
            ...Object.keys(otherActor.hooks).reduce((acc, key) => {
                const hook = Hook.create({
                    ...otherActor.hooks[key],
                    name: utils.pathify(actor.name, key),
                });

                acc[hook.name] = hook;
                return acc;
            }, {})
        };
    }

    return actor;
};

export const makeCrawlerOptions = async (actor: FT.ActorInstance, options?: FT.AnyCrawlerOptions): Promise<FT.AnyCrawlerOptions> => {
    const logger = Logger.create(actor);

    let mergedOptions = utils.merge({
        maxRequestRetries: 3,
        launchContext: {
            launchOptions: {
                headless: true,
                args: [
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                ],
            },
        }
    } as FT.AnyCrawlerOptions, options || {});

    Object.assign<FT.AnyCrawlerOptions, FT.AnyCrawlerOptions>(
        mergedOptions,
        {
            requestQueue: (await RequestQueue.load(actor?.queues?.default))?.resource,
            preNavigationHooks: [
                async (context, goToOptions) => {
                    const contextApi = ContextApi.create(actor as FT.MaybeAny);
                    await Hook.run(actor?.hooks?.preNavigationHook, actor, context as FT.RequestContext, contextApi(context as FT.MaybeAny), goToOptions);
                }
            ],
            postNavigationHooks: [
                async (context, goToOptions) => {
                    const contextApi = ContextApi.create(actor as FT.MaybeAny);
                    await Hook.run(actor?.hooks?.postNavigationHook, actor, context as FT.RequestContext, contextApi(context as FT.MaybeAny), goToOptions);
                }
            ],
            requestHandler: (async (context: FT.RequestContext) => {
                Logger.info(logger, `Running ${context?.request.url}`);

                const meta = RequestMeta.create(context);
                const actorId = meta.data.actorName as string;

                const step = getStep(actor, actorId, meta.data.stepName);
                await Step.run(step, actor, context);

            }) as FT.ReallyAny,
            failedRequestHandler: (async (context: FT.RequestContext) => {
                const meta = RequestMeta.create(context);
                const actorId = meta.data.actorName as string;

                const step = getStep(actor, actorId, meta.data.stepName);
                const contextApi = ContextApi.create(actor);
                await Hook.run(step?.hooks?.postRequestFailedHook, context as FT.RequestContext, contextApi(context), actor);

                await Hook.run(actor?.hooks?.postStepRequestFailedHook, actor, context as FT.RequestContext, contextApi(context), context.request.errorMessages);
            }) as FT.ReallyAny,
        }
    )

    return mergedOptions;
};

export const prefix = (actor: Pick<FT.ActorInstance, 'name'>, name: string): string => {
    return CONST.PREFIXED_NAME_BY_ACTOR(actor.name, CONST.UNPREFIXED_NAME_BY_ACTOR(name));
};


export const getFlow = (actor: FT.ActorInstance, actorName: string, flowName: string): FT.StepInstance => {
    return actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, CONST.UNPREFIXED_NAME_BY_ACTOR(flowName))]
}

export const getStep = (actor: FT.ActorInstance, actorName: string, stepName: string): FT.StepInstance => {
    return actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, CONST.UNPREFIXED_NAME_BY_ACTOR(stepName))]
}

export const load = async (actor: FT.ActorInstance): Promise<FT.ActorInstance> => {

    const defaultStateStores = [
        { name: 'state', kvKey: 'state' },
        { name: 'trails', kvKey: 'trails', splitByKey: true },
        { name: 'incorrectDataset', kvKey: 'incorrect-dataset' },
    ];

    // const DefautFileStores = [
    //     { name: 'files', kvKey: 'felps-cached-request' },
    //     { name: 'files', kvKey: 'felps-files' },
    //     { name: 'responseBodies', kvKey: 'felps-response-bodies' },
    //     { name: 'browserTraces', kvKey: 'felps-browser-traces' },
    // ];

    const datasetsLoaded = await Promise.all(
        Object.values({
            default: Dataset.create({}),
            ...actor.datasets,
        } as Record<string, FT.RequestQueueInstance>).map(async (dataset) => {
            return Dataset.load(dataset as FT.DatasetInstance);
        }));

    const stores = Object.values(defaultStateStores).reduce((acc, val) => {
        const store = State.create(val);
        acc[store.name] = store;
        return acc;
    }, {} as { [key: string]: FT.AnyStoreLike });

    const storesLoaded = await Promise.all(
        Object.values(stores as Record<string, FT.AnyStoreLike>).map(async (store) => {
            if (store.type === 'state') {
                const loaded = await State.load(store as FT.StateInstance);
                // State.listen(loaded);
                return loaded;
            }
            // if (store.type === 'bucket') {
            //     return Bucket.load(store as FT.BucketInstance);
            // }
            return Promise.resolve(store);
        }),
    ) as FT.AnyStoreLike[];

    const queuesLoaded = await Promise.all(
        Object.values({
            default: RequestQueue.create({}),
            ...actor.queues,
        } as Record<string, FT.RequestQueueInstance>).map(async (queue) => {
            return RequestQueue.load(queue as FT.RequestQueueInstance);
        }));

    return {
        ...actor,
        datasets: datasetsLoaded.reduce((acc, dataset: FT.DatasetInstance) => {
            acc[dataset.name] = dataset;
            return acc;
        }, {}),
        queues: queuesLoaded.reduce((acc, queue: FT.RequestQueueInstance) => {
            acc[queue.name] = queue;
            return acc;
        }, {}),
        stores: storesLoaded.reduce((acc, store: FT.AnyStoreLike) => {
            acc[store.name] = store;
            return acc;
        }, {})
    }
}

export const run = async (actor: FT.ActorInstance, input: FT.ActorInput): Promise<void> => {
    actor.input = input;
    actor = await load(actor);

    const contextApi = ContextApi.create(actor);

    const crawlerOptions = await makeCrawlerOptions(actor, actor?.crawlerOptions);

    try {
        /**
         * Run any logic before the actor starts
         * By default:
         *  - Load the stores
         */
        await Hook.run(actor?.hooks?.preActorStartedHook, actor, contextApi({} as FT.ReallyAny));

        /**
         * Run any logic before the crawler starts
         * By default: (does nothing for now)
         */
        await Hook.run(actor?.hooks?.preCrawlerStartedHook, actor, contextApi({} as FT.ReallyAny));

        /**
         * Run any logic before the queue starts
         * By default:
         *  - Load the queues
         */
        await Hook.run(actor?.hooks?.preQueueStartedHook, actor);

        const crawlerInstance = await Promise.resolve(actor?.crawler?.() || actor.crawler);
        await Crawler.run(crawlerInstance, crawlerOptions);

        /**
         * Run any logic once the queue ended
         * By default: (does nothing for now)
         */
        await Hook.run(actor?.hooks?.postQueueEndedHook, actor);

        /**
         * Run any logic once the crawler ended
         * By default: (does nothing for now)
         */
        await Hook.run(actor?.hooks?.postCrawlerEndedHook, actor, contextApi({} as FT.ReallyAny));

    } catch (error) {
        /**
         * Run any logic once the actor failed
         * By default:
         *  - Logs to the console
         */
        await Hook.run(actor?.hooks?.postCrawlerFailedHook, actor, error);

        throw error;

    } finally {
        /**
         * Run any logic once the actor ended
         * By default:
         *  - Persist the stores
         *  - Close datasets
         */
        await Hook.run(actor?.hooks?.postActorEndedHook, actor, contextApi({} as FT.ReallyAny));
    }
};

export default { create, prepareHooks, run, prefix, combine, getFlow, getStep };
