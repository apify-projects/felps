"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.extend = exports.create = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const apify_1 = tslib_1.__importDefault(require("apify"));
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const crawler_1 = tslib_1.__importDefault(require("./crawler"));
const use_handle_failed_request_function_1 = tslib_1.__importDefault(require("./crawler/use-handle-failed-request-function"));
const use_handle_page_function_1 = tslib_1.__importDefault(require("./crawler/use-handle-page-function"));
const use_post_navigation_hooks_1 = tslib_1.__importDefault(require("./crawler/use-post-navigation-hooks"));
const use_pre_navigation_hooks_1 = tslib_1.__importDefault(require("./crawler/use-pre-navigation-hooks"));
const create = (options) => {
    return {
        ...base_1.default.create({ key: 'actor', name: options?.name || 'default' }),
        ...(0, exports.extend)({}, options),
    };
};
exports.create = create;
const extend = (actor, options = {}) => {
    return {
        ...actor,
        input: options?.input || _1.Input.create({ INPUT: { schema: { type: 'object' } } }),
        crawlerMode: options?.crawlerMode || 'http',
        crawler: options?.crawler || actor.crawler || crawler_1.default.create(),
        steps: options?.steps || actor.steps || _1.Steps.create({ STEPS: {}, INPUT: { schema: { type: 'object' } } }),
        flows: options?.flows || actor.flows || _1.Flows.create({ FLOWS: {} }),
        models: options?.models || actor.models || _1.Models.create({ MODELS: {} }),
        stores: options?.stores || actor.stores || _1.Stores.create(),
        queues: options?.queues || actor.queues || _1.Queues.create(),
        datasets: options?.datasets || actor.datasets || _1.Datasets.create(),
        hooks: options?.hooks || actor.hooks || _1.Hooks.create({ MODELS: {}, STEPS: {}, FLOWS: {}, INPUT: { schema: { type: 'object' } } }),
    };
};
exports.extend = extend;
const run = async (actor) => {
    // Initialize actor
    actor.stores = await _1.Stores.load(actor?.stores);
    _1.Stores.listen(actor.stores);
    const input = await apify_1.default.getInput() || {};
    // TODO: Validate input against schema!
    actor.input.data = input;
    const { proxy } = input;
    const proxyConfiguration = proxy ? await apify_1.default.createProxyConfiguration(proxy) : undefined;
    const preNavigationHooksList = (0, use_pre_navigation_hooks_1.default)(actor);
    const postNavigationHooksList = (0, use_post_navigation_hooks_1.default)();
    // VALIDATE INPUT
    const preNavigationHooks = [
        preNavigationHooksList.requestHook,
        preNavigationHooksList.trailHook,
    ];
    const postNavigationHooks = [
        postNavigationHooksList.trailHook,
    ];
    // Hook to help with preparing the queue
    // Given a polyfilled requestQueue and the input data
    // User can add to the queue the starting requests to be crawled
    await _1.Step.run(actor?.hooks?.ACTOR_STARTED, actor, undefined);
    await _1.Step.run(actor?.hooks?.QUEUE_STARTED, actor, undefined);
    /**
   * Run async requests
   */
    await crawler_1.default.run(actor.crawler, {
        requestQueue: (await _1.Queue.load(actor?.queues?.default)).resource,
        handlePageFunction: (0, use_handle_page_function_1.default)(actor),
        handleFailedRequestFunction: (0, use_handle_failed_request_function_1.default)(actor),
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
    await _1.Step.run(actor?.hooks?.QUEUE_ENDED, actor, undefined);
    // TODO: Provider functionnalities to the end hook
    await _1.Step.run(actor?.hooks?.ACTOR_ENDED, actor, undefined);
    // Closing..
    await _1.Stores.persist(actor.stores);
};
exports.run = run;
exports.default = { create: exports.create, extend: exports.extend, run: exports.run };
//# sourceMappingURL=actor.js.map