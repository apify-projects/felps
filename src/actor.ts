/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify, { PlaywrightHook } from 'apify';
import { Datasets, Flows, Hooks, Models, Queue, Queues, Step, Steps, Stores } from '.';
import Base from './base';
import { ActorInstance, ActorOptions } from './common/types';
import crawler from './crawler';
import useHandleFailedRequestFunction from './crawler/use-handle-failed-request-function';
import useHandlePageFunction from './crawler/use-handle-page-function';
import usePostNavigationHooks from './crawler/use-post-navigation-hooks';
import usePreNavigationHooks from './crawler/use-pre-navigation-hooks';

export const create = (options?: ActorOptions): ActorInstance => {
    return {
        ...Base.create({ key: 'actor', name: options.name || 'default' }),
        ...extend({} as ActorInstance, options),
    };
};

export const extend = (actor: ActorInstance, options: ActorOptions = {}): ActorInstance => {
    return {
        ...actor,
        input: undefined,
        crawler: options?.crawler || actor.crawler || crawler.create(),
        steps: options?.steps || actor.steps || Steps.create(),
        flows: options?.flows || actor.flows || Flows.create(),
        models: options?.models || actor.models || Models.create(),
        stores: options?.stores || actor.stores || Stores.create(),
        queues: options?.queues || actor.queues || Queues.create(),
        datasets: options?.datasets || actor.datasets || Datasets.create(),
        hooks: options?.hooks || actor.hooks || Hooks.create(),
    };
};

export const run = async (actor: ActorInstance): Promise<void> => {
    // Initialize actor
    actor.stores = await Stores.load(actor.stores);
    Stores.listen(actor.stores);

    const input = await Apify.getInput() || {};
    actor.input = input;

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
    await Step.run(actor.hooks.ACTOR_STARTED, actor, undefined);

    await Step.run(actor.hooks.QUEUE_STARTED, actor, undefined);

    /**
   * Run async requests
   */
    await crawler.run(actor.crawler, {
        requestQueue: (await Queue.load(actor.queues.default)).resource,
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
    await Step.run(actor.hooks.QUEUE_ENDED, actor, undefined);

    // TODO: Provider functionnalities to the end hook
    await Step.run(actor.hooks.ACTOR_ENDED, actor, undefined);

    // Closing..
    await Stores.persist(actor.stores);
};

export default { create, extend, run };
