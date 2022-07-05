import * as CONST from '@usefelps/constants';
import crawler from '@usefelps/crawler';
import Hook from '@usefelps/hook';
import Base from '@usefelps/instance-base';
import Logger from '@usefelps/logger';
import RequestMeta from '@usefelps/request-meta';
import Step from '@usefelps/step';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

export const create = <
    ITCrawler extends FT.CrawlerInstance,
    ITStores extends Array<FT.AnyStoreLike>,
    ITQueues extends Array<FT.RequestQueueInstance>,
    ITDatasets extends Array<FT.DatasetInstance>,
    ITFlows extends Array<FT.FlowInstance>,
    ITSteps extends Array<FT.StepInstance>,
    ITContextApi extends Array<FT.GeneralContextApi>,
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

    return {
        ...base,

        stores: options?.stores,
        datasets: options?.datasets,
        queues: options?.queues,

        flows: options?.flows,
        steps: options?.steps,

        contextApi: options?.contextApi,

        crawler: options?.crawler,
        crawlerMode: options?.crawlerMode || 'http',
        crawlerOptions: options?.crawlerOptions,

        hooks: options?.hooks || createHooks<
            ITCrawler,
            ITStores,
            ITQueues,
            ITDatasets,
            ITFlows,
            ITSteps,
            ITContextApi
        >(options),
    } as LocalActorInstance;
};

export const createHooks = <
    ITCrawler extends FT.CrawlerInstance,
    ITStores extends Array<FT.AnyStoreLike>,
    ITQueues extends Array<FT.RequestQueueInstance>,
    ITDatasets extends Array<FT.DatasetInstance>,
    ITFlows extends Array<FT.FlowInstance>,
    ITSteps extends Array<FT.StepInstance>,
    ITContextApi extends Array<FT.GeneralContextApi>,
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
>): FT.ActorHooks<
    ITCrawler,
    ITStores,
    ITQueues,
    ITDatasets,
    ITFlows,
    ITSteps,
    ITContextApi,
    LocalActorInstance
> => {
    const { hooks } = options || {};

    const base = Base.create({ key: 'actor', name: options.name });
    const validationHandler = async (actor?: LocalActorInstance) => actor.name === base.name;

    return {
        preActorStartedHook: Hook.create<[actor?: LocalActorInstance, input?: FT.ActorInput]>({
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
        }),

        preCrawlerStartedHook: Hook.create<[actor?: LocalActorInstance]>({
            name: utils.pathify(base.name, 'preCrawlerStartedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.preCrawlerStartedHook?.handlers || []),
            ],
        }),

        postCrawlerEndedHook: Hook.create<[actor: LocalActorInstance]>({
            name: utils.pathify(base.name, 'postCrawlerEndedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.postCrawlerEndedHook?.handlers || []),
            ],
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
        }),

        postQueueEndedHook: Hook.create<[actor: LocalActorInstance]>({
            name: utils.pathify(base.name, 'postQueueEndedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.postQueueEndedHook?.handlers || []),
            ],
        }),

        preFlowStartedHook: Hook.create<[actor: LocalActorInstance]>({
            name: utils.pathify(base.name, 'preFlowStartedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.preFlowStartedHook?.handlers || []),
            ],
        }),

        postFlowEndedHook: Hook.create<[actor: LocalActorInstance]>({
            name: utils.pathify(base.name, 'postFlowEndedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.postFlowEndedHook?.handlers || []),
            ],
        }),

        preStepStartedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext]>({
            name: utils.pathify(base.name, 'preStepStartedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.preStepStartedHook?.handlers || []),
            ],
        }),

        postStepEndedHook: Hook.create<[actor: LocalActorInstance, context: FT.RequestContext]>({
            name: utils.pathify(base.name, 'postStepEndedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.postStepEndedHook?.handlers || []),
            ],
        }),

        onStepFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
            name: utils.pathify(base.name, 'onStepFailedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.onStepFailedHook?.handlers || []),
            ],
        }),

        onStepRequestFailedHook: Hook.create<[actor: LocalActorInstance, error: FT.ReallyAny]>({
            name: utils.pathify(base.name, 'onStepRequestFailedHook'),
            validationHandler,
            handlers: [
                ...(hooks?.onStepRequestFailedHook?.handlers || []),
            ],
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

// export const makeCrawlerOptions = async (actor: FT.ActorInstance, options: PlaywrightCrawlerOptions): Promise<PlaywrightCrawlerOptions> => {
//     // const proxyConfiguration = proxy ? await Apify.createProxyConfiguration(proxy) : undefined;
//     const proxyConfiguration = undefined;

//     // const preNavigationHooksList = usePreNavigationHooks(actor);
//     // const postNavigationHooksList = usePostNavigationHooks();

//     // VALIDATE INPUT

//     const preNavigationHooks = [
//         // preNavigationHooksList.flowHook,
//         // preNavigationHooksList.requestHook,
//         // preNavigationHooksList.trailHook,
//     ] as unknown as PlaywrightHook[];

//     const postNavigationHooks = [
//         // postNavigationHooksList.trailHook,
//     ];

//     const defaultOptions = {
//         handlePageTimeoutSecs: 120,
//         navigationTimeoutSecs: 60,
//         maxConcurrency: 40,
//         maxRequestRetries: 3,
//         requestQueue: (await Queue.load(actor?.queues?.default as FT.RequestRequestQueueInstance))?.resource as RequestQueue,
//         // handlePageFunction: useHandlePageFunction(actor) as any,
//         // handleFailedRequestFunction: useHandleFailedRequestFunction(actor) as any,
//         launchContext: {
//             launchOptions: {
//                 headless: false,
//             },

//         },
//         proxyConfiguration,
//         preNavigationHooks,
//         postNavigationHooks,
//     };

//     return utils.merge(defaultOptions, options) as PlaywrightCrawlerOptions;
// };

export const prefix = (actor: FT.ActorInstance, text: string): string => {
    return CONST.PREFIXED_NAME_BY_ACTOR(actor.name, text);
};

export const getStep = (actor: FT.ActorInstance, actorName: string, stepName: string): FT.StepInstance => {
    return actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, CONST.UNPREFIXED_NAME_BY_ACTOR(stepName))];
}

export const run = async (actor: FT.ActorInstance, input: FT.ActorInput): Promise<void> => {

    const crawlerOptions = {
        async requestHandler(context: FT.RequestContext) {
            const meta = RequestMeta.create(context);
            const metaHook = RequestMeta.extend(meta, { isHook: true });
            const contextHook = {
                ...context,
                request: metaHook.request,
            } as FT.RequestContext;

            const actorKey = meta.data.context.actorKey as string;

            const step = getStep(actor, actorKey, meta.data.context.stepName);

            if (!step) {
                return;
            }

            // const contextApi = ContextApi.create();

            if (!meta.data.stepStop) {

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

            // await Orchestrator.run(Orchestrator.create(actor), context, contextApi(context));
        },
    };

    try {
        /**
         * Run any logic before the actor starts
         * By default:
         *  - Load the stores
         */
        await Hook.run(actor?.hooks?.preActorStartedHook, actor, input);

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

        await crawler.run(actor.crawler as FT.CrawlerInstance, crawlerOptions);

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

export default { create, createHooks, run, prefix, combine };
