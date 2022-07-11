import { Dictionary, PlaywrightCrawlingContext } from '@crawlee/playwright';
import * as CONST from '@usefelps/constants';
import ContextApi from '@usefelps/context-api';
import Crawler from '@usefelps/crawler';
import Hook from '@usefelps/hook';
import Base from '@usefelps/instance-base';
import Logger from '@usefelps/logger';
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

    const base = Base.create({ key: 'actor', name: options.name });

    const extendMetaContext = <T extends Record<string, FT.ReallyAny>>(collection: T, meta: FT.RequestMetaData): T => {
        return Object.keys(collection).reduce<FT.ReallyAny>((acc, key) => {
            const value = collection[key];

            const extended = {
                ...value,
                ...Base.create({ name: prefix({ name: base.name }, value.name), key: value.key }),
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
        crawlerOptions: options?.crawlerOptions,
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

        const base = Base.create({ key: 'actor-hooks', name: actor.name });
        const validationHandler = async (actor?: LocalActorInstance) => {
            return actor.name === base.name
        };

        return {
            preActorStartedHook: Hook.create<[actor?: LocalActorInstance, api?: FT.TContextApi]>({
                name: utils.pathify(base.name, 'preActorStartedHook'),
                validationHandler,
                handlers: [
                    async function EXPAND_STATE() {
                        // actor, input
                        // actor.input.data = input;
                    },
                    async function LOAD_STORES() {
                        // actor
                        // Load stores
                        // actor.stores = await StoreCollection.load(actor?.stores as FT.StoreCollectionInstance);
                        // StoreCollection.listen(actor.stores);
                    },
                    ...(hooks?.preActorStartedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preActorStartedHook?.onErrorHook,
            }),
            postActorEndedHook: Hook.create<[actor: LocalActorInstance]>({
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

            preCrawlerStartedHook: Hook.create<[actor?: LocalActorInstance]>({
                name: utils.pathify(base.name, 'preCrawlerStartedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.preCrawlerStartedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preCrawlerStartedHook?.onErrorHook,
            }),

            postCrawlerEndedHook: Hook.create<[actor: LocalActorInstance]>({
                name: utils.pathify(base.name, 'postCrawlerEndedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postCrawlerEndedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postCrawlerEndedHook?.onErrorHook,
            }),

            onCrawlerFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'onCrawlerFailedHook'),
                validationHandler,
                handlers: [
                    async function LOGGING(actor, error) {
                        Logger.error(Logger.create(actor), `Actor ${actor.name} failed`, { error } as FT.ReallyAny);
                    },
                    ...(hooks?.onCrawlerFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.onCrawlerFailedHook?.onErrorHook,
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

            prestartFlowedHook: Hook.create<[actor: LocalActorInstance]>({
                name: utils.pathify(base.name, 'prestartFlowedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.prestartFlowedHook?.handlers || []),
                ],
                onErrorHook: hooks?.prestartFlowedHook?.onErrorHook,
            }),

            postFlowEndedHook: Hook.create<[actor: LocalActorInstance]>({
                name: utils.pathify(base.name, 'postFlowEndedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postFlowEndedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postFlowEndedHook?.onErrorHook,
            }),

            preStepStartedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext]>({
                name: utils.pathify(base.name, 'preStepStartedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.preStepStartedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preStepStartedHook?.onErrorHook,
            }),

            postStepEndedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext]>({
                name: utils.pathify(base.name, 'postStepEndedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postStepEndedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postStepEndedHook?.onErrorHook,
            }),

            preNavigationHook: Hook.create<[actor: LocalActorInstance, context: PlaywrightCrawlingContext<Dictionary<any>>, goToOptions: Record<PropertyKey, any>]>({
                name: utils.pathify(base.name, 'preNavigationHook'),
                handlers: [
                    ...(hooks?.preNavigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.preNavigationHook?.onErrorHook,
            }),

            postNavigationHook: Hook.create<[actor: LocalActorInstance, context: PlaywrightCrawlingContext<Dictionary<any>>, goToOptions: Record<PropertyKey, any>]>({
                name: utils.pathify(base.name, 'postNavigationHook'),
                handlers: [
                    ...(hooks?.postNavigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.postNavigationHook?.onErrorHook,
            }),

            onStepFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'onStepFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.onStepFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.onStepFailedHook?.onErrorHook,
            }),

            onStepRequestFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
                name: utils.pathify(base.name, 'onStepRequestFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.onStepRequestFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.onStepRequestFailedHook?.onErrorHook,
            }),
        }
    }

export const combine = (actor: FT.ActorInstance, ...actors: FT.ActorInstance[]): FT.ActorInstance => {
    for (const otherActor of actors) {
        actor.flows = { ...actor.flows, ...otherActor.flows };
        actor.steps = { ...actor.steps, ...otherActor.steps };
    }

    actor.hooks = Object.keys(actor.hooks).reduce((acc, key) => {
        acc[key] = Hook.create({
            name: utils.pathify(actor.name, key),
            handlers: [
                async (...args) => {
                    await Hook.run(actor.hooks[key], ...args);

                    for (const otherActor of actors) {
                        await Hook.run(otherActor.hooks[key], ...args);
                    }
                }
            ],
        });

        return acc;
    }, {});

    return actor;
};

export const makeCrawlerOptions = async (actor: FT.ActorInstance, options: FT.AnyCrawlerOptions): Promise<FT.AnyCrawlerOptions> => {

    const defaultOptions = {
        handlePageTimeoutSecs: 120,
        navigationTimeoutSecs: 60,
        maxConcurrency: 40,
        maxRequestRetries: 3,
        requestQueue: (await RequestQueue.load(actor?.queues?.default))?.resource,

        launchContext: {
            launchOptions: {
                headless: false,
                args: [
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                ],
            },
        },
        preNavigationHooks: [
            async (context, goToOptions) => {
                await Hook.run(actor?.hooks?.preNavigationHook, actor, context, goToOptions);
            }
        ],
        postNavigationHooks: [
            async (context, goToOptions) => {
                await Hook.run(actor?.hooks?.postNavigationHook, actor, context, goToOptions);
            }
        ]
    } as FT.AnyCrawlerOptions;

    return utils.merge(defaultOptions, options);
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

    const stores = Object.values(defaultStateStores).reduce((acc, val) => {
        const store = State.create(val);
        acc[store.name] = store;
        return acc;
    }, {} as { [key: string]: FT.AnyStoreLike });

    const storesLoaded = await Promise.all(
        Object.values(stores as Record<string, FT.AnyStoreLike>).map(async (store) => {
            if (store.type === 'state') {
                const loaded = await State.load(store as FT.StateInstance);
                State.listen(loaded);
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

    const logger = Logger.create(actor);

    const crawlerOptions = {
        requestQueue: actor?.queues?.default?.resource,
        async requestHandler(context: FT.RequestContext) {
            Logger.info(logger, `Running ${context?.request.url}`);

            const meta = RequestMeta.create(context);
            const metaHook = RequestMeta.extend(meta, { isHook: true });
            const contextHook = {
                ...context,
                request: metaHook.request,
            } as FT.RequestContext;

            const actorKey = meta.data.actorName as string;

            const step = getStep(actor, actorKey, meta.data.stepName);

            if (!step) {
                return;
            }

            const contextApi = ContextApi.create(actor);

            if (!meta.data.stopStep) {

                /**
                 * Run any logic before the step logic is executed.
                 * Ex: can be used for logging, anti-bot detection, catpatcha, etc.
                 * By default: (does nothing for now)
                 */
                await Hook.run(actor?.hooks?.preStepStartedHook, actor, contextHook);

                await Step.run(step, actor, context);

                /**
                 * Run any logic after the step logic has been executed.
                 * Ex: can be used for checking up data this would have been made ready to push to the dataset in KV.
                 * By default: (does nothing for now)
                 */
                await Hook.run(actor?.hooks?.postStepEndedHook, actor, contextHook);
            }

            await Orchestrator.run(Orchestrator.create(actor), context, contextApi(context));
        },
        async failedRequestHandler() {
            // This function is called when the crawling of a request failed too many times
            // await Dataset.pushData({
            //     url: request.url,
            //     succeeded: false,
            //     errors: request.errorMessages,
            // })
        },
    };

    const contextApi = ContextApi.create(actor);

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
        await Hook.run(actor?.hooks?.preCrawlerStartedHook, actor);

        /**
         * Run any logic before the queue starts
         * By default:
         *  - Load the queues
         */
        await Hook.run(actor?.hooks?.preQueueStartedHook, actor);

        await Crawler.run(actor.crawler as FT.CrawlerInstance, crawlerOptions);

        /**
         * Run any logic once the queue ended
         * By default: (does nothing for now)
         */
        await Hook.run(actor?.hooks?.postQueueEndedHook, actor);

        /**
         * Run any logic once the crawler ended
         * By default: (does nothing for now)
         */
        await Hook.run(actor?.hooks?.postCrawlerEndedHook, actor);

    } catch (error) {
        /**
         * Run any logic once the actor failed
         * By default:
         *  - Logs to the console
         */
        await Hook.run(actor?.hooks?.onCrawlerFailedHook, actor, error);

        throw error;

    } finally {
        /**
         * Run any logic once the actor ended
         * By default:
         *  - Persist the stores
         *  - Close datasets
         */
        await Hook.run(actor?.hooks?.postActorEndedHook, actor);
    }
};

export default { create, prepareHooks, run, prefix, combine, getFlow, getStep };
