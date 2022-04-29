/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify, { PlaywrightHook } from 'apify';
import { Datasets, Flows, Hooks, Input, Models, Queue, Queues, Step, Steps, Stores } from '.';
import Base from './base';
import { ActorInstance, ActorOptions, CrawlerInstance, QueueInstance, StepInstance, StoresInstance } from './types';
import crawler from './crawler';
import useHandleFailedRequestFunction from './crawler/use-handle-failed-request-function';
import useHandlePageFunction from './crawler/use-handle-page-function';
import usePostNavigationHooks from './crawler/use-post-navigation-hooks';
import usePreNavigationHooks from './crawler/use-pre-navigation-hooks';

export const create = (options?: ActorOptions): ActorInstance => {
    return {
        ...Base.create({ key: 'actor', name: options?.name || 'default' }),
        ...extend({} as ActorInstance, options),
    };
};

export const extend = (actor: ActorInstance, options: ActorOptions = {}): ActorInstance => {
    return {
        ...actor,
        input: options?.input || Input.create({ INPUT: { schema: { type: 'object' } } }),
        crawlerMode: options?.crawlerMode || 'http',
        crawler: options?.crawler || actor.crawler || crawler.create(),
        steps: options?.steps || actor.steps || Steps.create({ STEPS: {}, INPUT: { schema: { type: 'object' } } }),
        flows: options?.flows || actor.flows || Flows.create({ FLOWS: {} }),
        models: options?.models || actor.models || Models.create({ MODELS: {} }),
        stores: options?.stores || actor.stores || Stores.create(),
        queues: options?.queues || actor.queues || Queues.create(),
        datasets: options?.datasets || actor.datasets || Datasets.create(),
        hooks: options?.hooks || actor.hooks || Hooks.create({ MODELS: {}, STEPS: {}, FLOWS: {}, INPUT: { schema: { type: 'object' } } }),
    };
};

export const run = async (actor: ActorInstance): Promise<void> => {
    // Initialize actor
    actor.stores = await Stores.load(actor?.stores as StoresInstance);
    Stores.listen(actor.stores);

    const input = await Apify.getInput() || {};
    // TODO: Validate input against schema!
    actor.input.data = input;

    const { proxy } = input as any;
    const proxyConfiguration = proxy ? await Apify.createProxyConfiguration(proxy) : undefined;

    const preNavigationHooksList = usePreNavigationHooks(actor);
    const postNavigationHooksList = usePostNavigationHooks();

    // VALIDATE INPUT

    const preNavigationHooks = [
        preNavigationHooksList.requestHook,
        preNavigationHooksList.trailHook,
    ] as unknown as PlaywrightHook[];

    const postNavigationHooks = [
        postNavigationHooksList.trailHook,
    ];

    // Hook to help with preparing the queue
    // Given a polyfilled requestQueue and the input data
    // User can add to the queue the starting requests to be crawled
    await Step.run(actor?.hooks?.ACTOR_STARTED as StepInstance, actor, undefined);

    await Step.run(actor?.hooks?.QUEUE_STARTED as StepInstance, actor, undefined);

    /**
   * Run async requests
   */
    await crawler.run(actor.crawler as CrawlerInstance, {
        requestQueue: (await Queue.load(actor?.queues?.default as QueueInstance)).resource,
        handlePageFunction: useHandlePageFunction(actor) as any,
        handleFailedRequestFunction: useHandleFailedRequestFunction(actor) as any,
        maxRequestRetries: 1,
        launchContext: {
            launchOptions: {
                headless: false,
            },
        },
        proxyConfiguration,
        preNavigationHooks,
        postNavigationHooks,
    });

    /**
   * Run the serial requests
   */

    //   while ((storesApi.get().state.get('serial-queue') || []).length) {
    //       const serialRequest = storesApi.get().state.shift('serial-queue');
    //       this.log.info(`Starting a new serial request`, { serialRequest });
    //       await requestQueue.addRequest(serialRequest);
    //       await getCrawler().then((crawler) => crawler.run());
    //   }

    // TODO: Provider functionnalities to the end hook
    await Step.run(actor?.hooks?.QUEUE_ENDED as StepInstance, actor, undefined);

    // TODO: Provider functionnalities to the end hook
    await Step.run(actor?.hooks?.ACTOR_ENDED as StepInstance, actor, undefined);

    // Closing..
    await Stores.persist(actor.stores);
};

export default { create, extend, run };
