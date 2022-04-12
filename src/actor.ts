import Apify, { PlaywrightHook } from 'apify';
import Base from './base';
import { HOOK } from './common/consts';
import { ActorOptions } from './common/types';
import Datasets from './datasets';
import Flows from './flows';
import Hooks from './hooks';
import Models from './models';
import Queues from './queues';
import StepBaseApi from './step-base-api';
import StepCustomApi from './step-custom-api';
import Steps from './steps';
import Stores from './stores';
import useHandleFailedRequestFunction from './use-handle-failed-request-function';
import useHandlePageFunction from './use-handle-page-function';
import usePostNavigationHooks from './use-post-navigation-hooks';
import usePreNavigationHooks from './use-pre-navigation-hooks';
import Crawler from './crawler';

export default class Actor extends Base {
  private _initialized: boolean = false;

  steps?: Steps<any, any>;
  stepBaseApi?: StepBaseApi<any>;
  stepCustomApi?: StepCustomApi<any, any>;
  flows?: Flows<any>;
  models?: Models<any>;
  stores?: Stores<any>;
  queues?: Queues<any>;
  datasets?: Datasets<any>;
  hooks?: Hooks<any>;

  constructor(options: ActorOptions = {}) {
    const { name = 'default' } = options;
    super({ key: 'actor', name });
    this.extend(options);
  }

  extend(options: ActorOptions = {}) {
    this.steps = options.steps || this.steps || new Steps();
    this.stepBaseApi = options.stepBaseApi || this.stepBaseApi || new StepBaseApi();
    this.stepCustomApi = options.stepCustomApi || this.stepCustomApi;
    this.flows = options.flows || this.flows || new Flows();
    this.models = options.models || this.models || new Models();
    this.stores = options.stores || this.stores || new Stores();
    this.queues = options.queues || this.queues || new Queues();
    this.datasets = options.datasets || this.datasets || new Datasets();
    this.hooks = options.hooks || this.hooks || new Hooks();
  }

  init() {
    if (!this._initialized) {
      Apify.events.on('migrating', async () => {
        this.log.info('Migrating: Persisting stores...');
        await this.stores.persist();
      });

      Apify.events.on('aborting', async () => {
        this.log.info('Aborting: Persisting stores...');
        await this.stores.persist();
      });

      this._initialized = true;
    }
  }

  async run() {
    this.init();

    const input = await Apify.getInput();

    const { proxy } = input as any;
    const proxyConfiguration = proxy ? await Apify.createProxyConfiguration(proxy) : undefined;

    const preNavigationHooksList = usePreNavigationHooks(this);
    const postNavigationHooksList = usePostNavigationHooks(this);

    // VALIDATE INPUT

    const preNavigationHooks = [
      preNavigationHooksList.requestHook,
      preNavigationHooksList.trailHook,
    ] as unknown as PlaywrightHook[];

    const postNavigationHooks = [
      postNavigationHooksList.trailHook,
    ];

    const requestQueue = await Apify.openRequestQueue();

    const getCrawler = () => new Crawler({
      requestQueue,
      handlePageFunction: useHandlePageFunction(this),
      handleFailedRequestFunction: useHandleFailedRequestFunction(this),
      proxyConfiguration,
      preNavigationHooks,
      postNavigationHooks,
    })

    // Hook to help with preparing the queue
    // Given a polyfilled requestQueue and the input data
    // User can add to the queue the starting requests to be crawled
    await this.hooks?.[HOOK.ROUTER_STARTED]?.run?.(undefined);

    await this.hooks?.[HOOK.QUEUE_STARTED]?.run?.(undefined);

    /**
     * Run async requests
     */
    if (!await requestQueue.isEmpty()) {
      await getCrawler().run();
    }

    /**
     * Run the serial requests
     */

    // while ((storesApi.get().state.get('serial-queue') || []).length) {
    //     const serialRequest = storesApi.get().state.shift('serial-queue');
    //     this.log.info(`Starting a new serial request`, { serialRequest });
    //     await requestQueue.addRequest(serialRequest);
    //     await getCrawler().then((crawler) => crawler.run());
    // }

    // TODO: Provider functionnalities to the end hook
    await this.hooks?.[HOOK.QUEUE_ENDED]?.run?.(undefined);

    // TODO: Provider functionnalities to the end hook
    await this.hooks?.[HOOK.ROUTER_ENDED]?.run?.(undefined);

    await this.stores.persist();
  }
};
