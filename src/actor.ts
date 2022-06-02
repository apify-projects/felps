/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlaywrightCrawlerOptions, PlaywrightHook, RequestQueue } from 'apify';
import mergeDeep from 'merge-deep';
import {
    DatasetCollection, Flow, FlowCollection, HookCollection, Input, Logger,
    ModelCollection, Queue, QueueCollection, RequestMeta, Step, StepCollection, StoreCollection,
} from '.';
import Base from './base';
import { PREFIXED_NAME_BY_ACTOR, UNPREFIXED_NAME_BY_ACTOR } from './consts';
import crawler from './crawler';
import useHandleFailedRequestFunction from './crawler/use-handle-failed-request-function';
import useHandlePageFunction from './crawler/use-handle-page-function';
import usePostNavigationHooks from './crawler/use-post-navigation-hooks';
import usePreNavigationHooks from './crawler/use-pre-navigation-hooks';
import { globalHookNames } from './hook-collection';
import {
    ActorInput, ActorInstance, ActorOptions, CrawlerInstance,
    QueueInstance, ReallyAny, RequestCrawlerOptions, StepInstance, StoreCollectionInstance,
} from './types';

export const create = (options: ActorOptions): ActorInstance => {
    return {
        ...Base.create({ key: 'actor', name: options.name }),
        ...extend({} as ActorInstance, options),
    };
};

export const extend = (actor: ActorInstance, options: Partial<ActorOptions> = {}): ActorInstance => {
    const instance = {
        ...actor,
        name: options.name || actor.name,
        input: options?.input || Input.create({ INPUT: { schema: { type: 'object' } } }),
        crawlerOptions: mergeDeep({ mode: 'http' }, options?.crawlerOptions || {}) as RequestCrawlerOptions,
        crawler: options?.crawler || actor.crawler || crawler.create(),
        steps: (options?.steps || actor.steps || StepCollection.create({ STEPS: {}, INPUT: { schema: { type: 'object' } } })) as ReallyAny,
        stepApiOptions: (options?.stepApiOptions || {}),
        flows: (options?.flows || actor.flows || FlowCollection.create({ FLOWS: {} })) as ReallyAny,
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

export const combine = (actor: ActorInstance, ...actors: ActorInstance[]): ActorInstance => {
    for (const other of actors) {
        actor.flows = { ...actor.flows, ...other.flows };
        actor.steps = { ...actor.steps, ...other.steps };
        actor.hooks = { ...actor.hooks, ...other.hooks };
    }

    const mainHookCollection = Object
        .keys(actor.hooks)
        .filter((key) => key.startsWith(prefix(actor, '')) && globalHookNames.some((name) => key.endsWith(name)))
        .map((key) => (actor.hooks as ReallyAny)[key]) as StepInstance[];

    const otherHookCollection = Object
        .keys(actor.hooks)
        .filter((key) => !key.startsWith(prefix(actor, '')) && globalHookNames.some((name) => key.endsWith(name)))
        .map((key) => (actor.hooks as ReallyAny)[key]) as StepInstance[];

    // Propagate hooks to other actors
    for (const hook of mainHookCollection) {
        hook.afterHandler = async (context) => {
            const hooksPromises = [];
            for (const otherHook of otherHookCollection) {
                if (
                    !otherHook.name.startsWith(prefix(actor, ''))
                    && otherHook.name.endsWith(UNPREFIXED_NAME_BY_ACTOR(hook.name))
                ) {
                    hooksPromises.push(Step.run(otherHook, actor, RequestMeta.cloneContext(context)));
                }
            }
            await Promise.allSettled(hooksPromises);
        };
    }

    return actor;
};

export const makeCrawlerOptions = async (actor: ActorInstance, options: PlaywrightCrawlerOptions): Promise<PlaywrightCrawlerOptions> => {
    // const proxyConfiguration = proxy ? await Apify.createProxyConfiguration(proxy) : undefined;
    const proxyConfiguration = undefined;

    const preNavigationHooksList = usePreNavigationHooks(actor);
    const postNavigationHooksList = usePostNavigationHooks();

    // VALIDATE INPUT

    const preNavigationHooks = [
        preNavigationHooksList.flowHook,
        preNavigationHooksList.requestHook,
        preNavigationHooksList.trailHook,
    ] as unknown as PlaywrightHook[];

    const postNavigationHooks = [
        postNavigationHooksList.trailHook,
    ];

    const defaultOptions = {
        handlePageTimeoutSecs: 120,
        navigationTimeoutSecs: 60,
        maxConcurrency: 40,
        maxRequestRetries: 3,
        requestQueue: (await Queue.load(actor?.queues?.default as QueueInstance))?.resource as RequestQueue,
        handlePageFunction: useHandlePageFunction(actor) as any,
        handleFailedRequestFunction: useHandleFailedRequestFunction(actor) as any,
        launchContext: {
            launchOptions: {
                headless: false,
            },
        },
        proxyConfiguration,
        preNavigationHooks,
        postNavigationHooks,
    };

    return {
        ...defaultOptions,
        ...options,
    };
};

export const prefix = (actor: ActorInstance, text: string): string => {
    return PREFIXED_NAME_BY_ACTOR(actor.name, text);
};

export const prefixStepCollection = (actor: ActorInstance): ActorInstance['steps'] => {
    return Object.keys(actor.steps).reduce((acc, key) => {
        const name = prefix(actor, actor.steps[key].name);
        acc[name] = Step.create({
            ...actor.steps[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {} as ActorInstance['steps']);
};

export const prefixFlowCollection = (actor: ActorInstance): ActorInstance['flows'] => {
    return Object.keys(actor.flows).reduce((acc, key) => {
        const name = prefix(actor, actor.flows[key].name);
        acc[name] = Flow.create({
            ...actor.flows[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {} as ActorInstance['flows']);
};

export const prefixHookCollection = (actor: ActorInstance): ActorInstance['hooks'] => {
    return Object.keys(actor.hooks).reduce((acc, key) => {
        const name = prefix(actor, (actor.hooks as ReallyAny)[key].name);
        (acc as ReallyAny)[name] = Step.create({
            ...(actor.hooks as ReallyAny)[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {} as ActorInstance['hooks']);
};

export const run = async (actor: ActorInstance, input: ActorInput, crawlerOptions?: PlaywrightCrawlerOptions): Promise<void> => {
    const startedAt = new Date().getTime();
    try {
        // Initialize actor
        actor.stores = await StoreCollection.load(actor?.stores as StoreCollectionInstance);
        StoreCollection.listen(actor.stores);

        actor.input.data = input;

        // Hook to help with preparing the queue
        // Given a polyfilled requestQueue and the input data
        // User can add to the queue the starting requests to be crawled
        await Step.run(actor?.hooks?.[prefix(actor, 'ACTOR_STARTED') as 'ACTOR_STARTED'] as StepInstance, actor, undefined);

        await Step.run(actor?.hooks?.[prefix(actor, 'QUEUE_STARTED') as 'QUEUE_STARTED'] as StepInstance, actor, undefined);

        /*
       * Run async requests
       */
        const crawlerOptionsComplete = await makeCrawlerOptions(actor, (crawlerOptions || {}) as PlaywrightCrawlerOptions);
        await crawler.run(actor.crawler as CrawlerInstance, crawlerOptionsComplete);

        // TODO: Provider functionnalities to the end hook
        await Step.run(actor?.hooks?.[prefix(actor, 'QUEUE_ENDED') as 'QUEUE_ENDED'] as StepInstance, actor, undefined);

        // TODO: Provider functionnalities to the end hook
        await Step.run(actor?.hooks?.[prefix(actor, 'ACTOR_ENDED') as 'ACTOR_ENDED'] as StepInstance, actor, undefined);
    } catch (error) {
        Logger.error(Logger.create(actor), `Actor ${actor.name} failed`, { error } as ReallyAny);
    } finally {
        // Closing..
        await StoreCollection.persist(actor.stores);
        await DatasetCollection.close(actor.datasets);
        const duration = new Date().getTime() - startedAt;
        Logger.info(Logger.create(actor), `Actor ${actor.name} finished in ${duration}ms (${duration / (3600 * 1000)} CUs)`);
    }
};

export default { create, extend, run, prefix, combine };
