import * as CONST from '@usefelps/constants';
import ContextApi from '@usefelps/context-api';
import Crawler from '@usefelps/crawler';
import Dataset from '@usefelps/dataset';
import Hook from '@usefelps/hook';
import InstanceBase from '@usefelps/instance-base';
import Logger from '@usefelps/logger';
import Process from '@usefelps/process';
import RequestMeta from '@usefelps/request-meta';
import RequestQueue from '@usefelps/request-queue';
import State from '@usefelps/state';
import Step from '@usefelps/step';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';
import { prepareHooks } from './hooks'

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

    // const DefautFileStores = [
    //     { name: 'files', kvKey: 'felps-cached-request' },
    //     { name: 'files', kvKey: 'felps-files' },
    //     { name: 'responseBodies', kvKey: 'felps-response-bodies' },
    //     { name: 'browserTraces', kvKey: 'felps-browser-traces' },
    // ];

    const instance = {
        ...base,
        input: options.input,
        data: options.data,
        stores: {
            ...utils.arrayToKeyedObject([
                State.create({ name: 'state', kvKey: 'state' }),
                State.create({ name: 'trails', kvKey: 'trails', splitByKey: true }),
                State.create({ name: 'incorrectDataset', kvKey: 'incorrect-dataset', splitByKey: true }),
            ], 'name'),
            ...(options?.stores || {}),
        },
        datasets: {
            default: Dataset.create({ name: 'default' }),
            ...(options?.datasets || {}),
        } as Record<string, FT.DatasetInstance>,
        queues: {
            default: RequestQueue.create({ name: 'default' }),
            ...(options?.queues || {}),
        } as Record<string, FT.RequestQueueInstance>,

        flows: extendMetaContext(options?.flows || {}, { actorName: base.name }),
        steps: extendMetaContext(options?.steps || {}, { actorName: base.name }),

        contextApi: options?.contextApi,

        crawler: options?.crawler,
        crawlerMode: options?.crawlerMode || 'http',
        crawlerOptions: options?.crawlerOptions || {},
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
        },
        // browserPoolOptions: {
        //     postLaunchHooks: [
        //         async (_, browserController) => {
        //             const promises = [];



        //             await Promise.all(promises);
        //         },
        //     ],
        // }
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

    const datasetsLoaded = await Promise.all(
        Object.values<FT.DatasetInstance>((actor.datasets || {}))
            .map(async (dataset) => {
                return Dataset.load(dataset);
            }));


    const storesLoaded = await Promise.all(
        Object.values<FT.AnyStoreLike>(actor.stores || {})
            .map(async (store) => {
                if (store.type === 'state') {
                    const loaded = await State.load(store);
                    State.listen(loaded);
                    return loaded;
                }
                // if (store.type === 'bucket') {
                //     return Bucket.load(store as FT.BucketInstance);
                // }
                return Promise.resolve(store);
            }),
    );

    const queuesLoaded = await Promise.all(
        Object.values<FT.RequestQueueInstance>(actor.queues || {})
            .map(async (queue) => {
                return RequestQueue.load(queue);
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

    Process.onExit(async (evt) => {
        await Hook.run(actor?.hooks?.preBlackoutHook, actor, evt);
    })

    const contextApi = ContextApi.create(actor);

    const crawlerOptions = await makeCrawlerOptions(actor, actor?.crawlerOptions);

    try {
        /**
         * Run any logic before the actor starts
         * By default:
         *  - Load the stores
         */
        await Hook.run(actor?.hooks?.preStartedHook, actor, contextApi({} as FT.ReallyAny));

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

        const crawlerInstance = await Promise.resolve(actor?.crawler?.(actor as FT.ActorInstanceBase) || actor.crawler);
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
        try {
            await Hook.run(actor?.hooks?.preCrawlerFailedHook, actor, error);

            await Hook.run(actor?.hooks?.postCrawlerFailedHook, actor, error);

        } catch (err) {
            throw err;
        }

    } finally {

        await Hook.run(actor?.hooks?.preEndedHook, actor, contextApi({} as FT.ReallyAny));
    }
};

export default { create, prepareHooks, run, prefix, combine, getFlow, getStep };
