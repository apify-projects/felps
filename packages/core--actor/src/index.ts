import * as CONST from '@usefelps/core--constants';
import crawler from '@usefelps/core--crawler';
// import useHandleFailedRequestFunction from '@usefelps/core--crawler/lib/use-handle-failed-request-function';
// import useHandlePageFunction from '@usefelps/core--crawler/lib/use-handle-page-function';
// import usePostNavigationHooks from '@usefelps/core--crawler/lib/use-post-navigation-hooks';
// import usePreNavigationHooks from '@usefelps/core--crawler/lib/use-pre-navigation-hooks';
import DatasetCollection from '@usefelps/core--dataset-collection';
import Flow from '@usefelps/core--flow';
import FlowCollection from '@usefelps/core--flow-collection';
import HookCollection, { globalHookNames } from '@usefelps/core--hook-collection';
import Input from '@usefelps/core--input';
import Base from '@usefelps/core--instance-base';
import ModelCollection from '@usefelps/core--model-collection';
import Queue from '@usefelps/core--request-queue';
import QueueCollection from '@usefelps/core--request-queue-collection';
import RequestMeta from '@usefelps/core--request-meta';
import Step from '@usefelps/core--step';
import StepCollection from '@usefelps/core--step-collection';
import StoreCollection from '@usefelps/core--store-collection';
import Logger from '@usefelps/helper--logger';
import * as utils from '@usefelps/helper--utils';
import * as FT from '@usefelps/types';
import { RequestQueue } from '@crawlee/core';
import { PlaywrightCrawlerOptions, PlaywrightHook } from '@crawlee/playwright';

export const create = (options: FT.ActorOptions): FT.ActorInstance => {
    return {
        ...Base.create({ key: 'actor', name: options.name }),
        ...extend({} as FT.ActorInstance, options),
    };
};

export const extend = (actor: FT.ActorInstance, options: Partial<FT.ActorOptions> = {}): FT.ActorInstance => {
    const instance = {
        ...actor,
        name: options.name || actor.name,
        input: options?.input || Input.create({ INPUT: { schema: { type: 'object' } } }),
        crawlerOptions: utils.merge({ mode: 'http' }, options?.crawlerOptions || {}) as FT.RequestCrawlerOptions,
        crawler: options?.crawler || actor.crawler || crawler.create(),
        steps: (options?.steps || actor.steps || StepCollection.create({ STEPS: {}, INPUT: { schema: { type: 'object' } } })) as FT.ReallyAny,
        stepApiOptions: (options?.stepApiOptions || {}),
        flows: (options?.flows || actor.flows || FlowCollection.create({ FLOWS: {} })) as FT.ReallyAny,
        models: options?.models || actor.models || ModelCollection.create({ MODELS: {} }),
        stores: options?.stores || actor.stores || StoreCollection.create(),
        queues: options?.queues || actor.queues || QueueCollection.create(),
        datasets: options?.datasets || actor.datasets || DatasetCollection.create(),
        hooks: options?.hooks || actor.hooks || HookCollection.create({ MODELS: {}, STEPS: {}, FLOWS: {}, INPUT: { schema: { type: 'object' } } }),
    };

    instance.steps = prefixStepCollection(instance);
    instance.flows = prefixFlowCollection(instance);
    instance.hooks = prefixHookCollection(instance);

    return instance;
};

export const combine = (actor: FT.ActorInstance, ...actors: FT.ActorInstance[]): FT.ActorInstance => {
    for (const other of actors) {
        actor.flows = { ...actor.flows, ...other.flows };
        actor.steps = { ...actor.steps, ...other.steps };
        actor.hooks = { ...actor.hooks, ...other.hooks };
    }

    const mainHookCollection = Object
        .keys(actor.hooks)
        .filter((key) => key.startsWith(prefix(actor, '')) && globalHookNames.some((name) => key.endsWith(name)))
        .map((key) => (actor.hooks as FT.ReallyAny)[key]) as FT.StepInstance[];

    const otherHookCollection = Object
        .keys(actor.hooks)
        .filter((key) => !key.startsWith(prefix(actor, '')) && globalHookNames.some((name) => key.endsWith(name)))
        .map((key) => (actor.hooks as FT.ReallyAny)[key]) as FT.StepInstance[];

    // Propagate hooks to other actors
    for (const hook of mainHookCollection) {
        hook.afterHandler = async (context) => {
            const hooksPromises = [];
            for (const otherHook of otherHookCollection) {
                if (
                    !otherHook.name.startsWith(prefix(actor, ''))
                    && otherHook.name.endsWith(CONST.UNPREFIXED_NAME_BY_ACTOR(hook.name))
                ) {
                    hooksPromises.push(Step.run(otherHook, actor, RequestMeta.cloneContext(context)));
                }
            }
            await Promise.allSettled(hooksPromises);
        };
    }

    return actor;
};

export const makeCrawlerOptions = async (actor: FT.ActorInstance, options: PlaywrightCrawlerOptions): Promise<PlaywrightCrawlerOptions> => {
    // const proxyConfiguration = proxy ? await Apify.createProxyConfiguration(proxy) : undefined;
    const proxyConfiguration = undefined;

    // const preNavigationHooksList = usePreNavigationHooks(actor);
    // const postNavigationHooksList = usePostNavigationHooks();

    // VALIDATE INPUT

    const preNavigationHooks = [
        // preNavigationHooksList.flowHook,
        // preNavigationHooksList.requestHook,
        // preNavigationHooksList.trailHook,
    ] as unknown as PlaywrightHook[];

    const postNavigationHooks = [
        // postNavigationHooksList.trailHook,
    ];

    const defaultOptions = {
        handlePageTimeoutSecs: 120,
        navigationTimeoutSecs: 60,
        maxConcurrency: 40,
        maxRequestRetries: 3,
        requestQueue: (await Queue.load(actor?.queues?.default as FT.QueueInstance))?.resource as RequestQueue,
        // handlePageFunction: useHandlePageFunction(actor) as any,
        // handleFailedRequestFunction: useHandleFailedRequestFunction(actor) as any,
        launchContext: {
            launchOptions: {
                headless: false,
            },

        },
        proxyConfiguration,
        preNavigationHooks,
        postNavigationHooks,
    };

    // const enforcedOptions = {
    //     browserPoolOptions: {
    //         postLaunchHooks: [
    //             async (pageId, browserController) => {

    //             }
    //         ],
    //     },
    // }

    return utils.merge(defaultOptions, options) as PlaywrightCrawlerOptions;
};

export const prefix = (actor: FT.ActorInstance, text: string): string => {
    return CONST.PREFIXED_NAME_BY_ACTOR(actor.name, text);
};

export const prefixStepCollection = (actor: FT.ActorInstance): FT.ActorInstance['steps'] => {
    return Object.keys(actor.steps).reduce((acc, key) => {
        const name = prefix(actor, actor.steps[key].name);
        acc[name] = Step.create({
            ...actor.steps[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {} as FT.ActorInstance['steps']);
};

export const prefixFlowCollection = (actor: FT.ActorInstance): FT.ActorInstance['flows'] => {
    return Object.keys(actor.flows).reduce((acc, key) => {
        const name = prefix(actor, actor.flows[key].name);
        acc[name] = Flow.create({
            ...actor.flows[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {} as FT.ActorInstance['flows']);
};

export const prefixHookCollection = (actor: FT.ActorInstance): FT.ActorInstance['hooks'] => {
    return Object.keys(actor.hooks).reduce((acc, key) => {
        const name = prefix(actor, (actor.hooks as FT.ReallyAny)[key].name);
        (acc as FT.ReallyAny)[name] = Step.create({
            ...(actor.hooks as FT.ReallyAny)[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {} as FT.ActorInstance['hooks']);
};

export const load = async (actor: FT.ActorInstance) => {
    // Initialize actor
    actor.stores = await StoreCollection.load(actor?.stores as FT.StoreCollectionInstance);
    StoreCollection.listen(actor.stores);
};

export const run = async (actor: FT.ActorInstance, input: FT.ActorInput, crawlerOptions?: PlaywrightCrawlerOptions): Promise<void> => {
    const startedAt = new Date().getTime();
    try {
        await load(actor);

        actor.input.data = input;

        // Hook to help with preparing the queue
        // Given a polyfilled requestQueue and the input data
        // User can add to the queue the starting requests to be crawled
        await Step.run(actor?.hooks?.[prefix(actor, 'ACTOR_STARTED') as 'ACTOR_STARTED'] as FT.StepInstance, actor, undefined);

        await Step.run(actor?.hooks?.[prefix(actor, 'QUEUE_STARTED') as 'QUEUE_STARTED'] as FT.StepInstance, actor, undefined);

        /*
       * Run async requests
       */
        const crawlerOptionsComplete = await makeCrawlerOptions(actor, (crawlerOptions || {}) as PlaywrightCrawlerOptions);
        await crawler.run(actor.crawler as FT.CrawlerInstance, crawlerOptionsComplete);

        // TODO: Provider functionnalities to the end hook
        await Step.run(actor?.hooks?.[prefix(actor, 'QUEUE_ENDED') as 'QUEUE_ENDED'] as FT.StepInstance, actor, undefined);

        // TODO: Provider functionnalities to the end hook
        await Step.run(actor?.hooks?.[prefix(actor, 'ACTOR_ENDED') as 'ACTOR_ENDED'] as FT.StepInstance, actor, undefined);
    } catch (error) {
        Logger.error(Logger.create(actor), `Actor ${actor.name} failed`, { error } as FT.ReallyAny);
    } finally {
        // Closing..
        await StoreCollection.persist(actor.stores);
        await DatasetCollection.close(actor.datasets);
        const duration = new Date().getTime() - startedAt;
        Logger.info(Logger.create(actor), `Actor ${actor.name} finished in ${duration}ms`);
        // Logger.info(Logger.create(actor), `Actor ${actor.name} finished in ${duration}ms (${duration / (3600 * 1000)} CUs)`);
    }
};

export default { create, load, extend, run, prefix, combine };
