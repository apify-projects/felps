/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify, { PlaywrightHook } from 'apify';
import { ActorInstance, ActorOptions } from './common/types';
import Base from './base';
import crawler from './crawler';
import useHandleFailedRequestFunction from './crawler/use-handle-failed-request-function';
import useHandlePageFunction from './crawler/use-handle-page-function';
import usePostNavigationHooks from './crawler/use-post-navigation-hooks';
import usePreNavigationHooks from './crawler/use-pre-navigation-hooks';
import datasets from './datasets';
import Flows from './flows';
import Hooks from './hooks';
import Models from './models';
import Queues from './queues';
import Step from './step';
import Steps from './steps';
import Stores from './stores';

export const create = (options?: ActorOptions): ActorInstance => {
    return {
        ...Base.create({ key: 'actor', name: options.name || 'default' }),
        ...extend({} as ActorInstance, options),
    };
};

export const extend = (actor: ActorInstance, options: ActorOptions = {}): ActorInstance => {
    return {
        ...actor,
        crawler: options?.crawler || actor.crawler || crawler.create(),
        steps: options?.steps || actor.steps || Steps.create(),
        flows: options?.flows || actor.flows || Flows.create(),
        models: options?.models || actor.models || Models.create(),
        stores: options?.stores || actor.stores || Stores.create(),
        queues: options?.queues || actor.queues || Queues.create(),
        datasets: options?.datasets || actor.datasets || datasets.create(),
        hooks: options?.hooks || actor.hooks || Hooks.create(),
    };
};

export const run = async (actor: ActorInstance): Promise<void> => {
    // Initialize actor
    Stores.listen(actor.stores);

    const input = await Apify.getInput();

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

    const requestQueue = await Apify.openRequestQueue();

    const runCrawler = () => crawler.run(actor.crawler, {
        requestQueue,
        handlePageFunction: useHandlePageFunction(actor) as any,
        handleFailedRequestFunction: useHandleFailedRequestFunction(actor) as any,
        proxyConfiguration,
        preNavigationHooks,
        postNavigationHooks,
    });

    // Hook to help with preparing the queue
    // Given a polyfilled requestQueue and the input data
    // User can add to the queue the starting requests to be crawled
    await Step.run(actor.hooks.actorStarted, undefined, undefined);

    await Step.run(actor.hooks.queueStarted, undefined, undefined);

    /**
   * Run async requests
   */
    if (!await requestQueue.isEmpty()) {
        await runCrawler();
    }

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
    await Step.run(actor.hooks.queueEnded, undefined, undefined);

    // TODO: Provider functionnalities to the end hook
    await Step.run(actor.hooks.actorEnded, undefined, undefined);

    // Closing..
    await Stores.persist(actor.stores);
};

export default { create, extend, run };
