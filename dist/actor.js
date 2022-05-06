"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.prefixHooks = exports.prefixFlows = exports.prefixSteps = exports.prefix = exports.makeCrawlerOptions = exports.combine = exports.extend = exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const crawler_1 = tslib_1.__importDefault(require("./crawler"));
const use_handle_failed_request_function_1 = tslib_1.__importDefault(require("./crawler/use-handle-failed-request-function"));
const use_handle_page_function_1 = tslib_1.__importDefault(require("./crawler/use-handle-page-function"));
const use_post_navigation_hooks_1 = tslib_1.__importDefault(require("./crawler/use-post-navigation-hooks"));
const use_pre_navigation_hooks_1 = tslib_1.__importDefault(require("./crawler/use-pre-navigation-hooks"));
const hooks_1 = require("./hooks");
const create = (options) => {
    return {
        ...base_1.default.create({ key: 'actor', name: options.name }),
        ...(0, exports.extend)({}, options),
    };
};
exports.create = create;
const extend = (actor, options = {}) => {
    const instance = {
        ...actor,
        name: options.name || actor.name,
        input: options?.input || _1.Input.create({ INPUT: { schema: { type: 'object' } } }),
        crawlerMode: options?.crawlerMode || 'http',
        crawler: options?.crawler || actor.crawler || crawler_1.default.create(),
        steps: (options?.steps || actor.steps || _1.Steps.create({ STEPS: {}, INPUT: { schema: { type: 'object' } } })),
        flows: (options?.flows || actor.flows || _1.Flows.create({ FLOWS: {} })),
        models: options?.models || actor.models || _1.Models.create({ MODELS: {} }),
        stores: options?.stores || actor.stores || _1.Stores.create(),
        queues: options?.queues || actor.queues || _1.Queues.create(),
        datasets: options?.datasets || actor.datasets || _1.Datasets.create(),
        hooks: options?.hooks || actor.hooks || _1.Hooks.create({ MODELS: {}, STEPS: {}, FLOWS: {}, INPUT: { schema: { type: 'object' } } }),
    };
    instance.steps = (0, exports.prefixSteps)(instance);
    instance.flows = (0, exports.prefixFlows)(instance);
    instance.hooks = (0, exports.prefixHooks)(instance);
    return instance;
};
exports.extend = extend;
const combine = (actor, ...actors) => {
    for (const other of actors) {
        actor.flows = { ...actor.flows, ...other.flows };
        actor.steps = { ...actor.steps, ...other.steps };
        actor.hooks = { ...actor.hooks, ...other.hooks };
    }
    const mainHooks = Object
        .keys(actor.hooks)
        .filter((key) => key.startsWith((0, exports.prefix)(actor, '')) && hooks_1.globalHookNames.some((name) => key.endsWith(name)))
        .map((key) => actor.hooks[key]);
    const otherHooks = Object
        .keys(actor.hooks)
        .filter((key) => !key.startsWith((0, exports.prefix)(actor, '')) && hooks_1.globalHookNames.some((name) => key.endsWith(name)))
        .map((key) => actor.hooks[key]);
    // Propagate hooks to other actors
    for (const hook of mainHooks) {
        hook.afterHandler = async (context) => {
            const hooksPromises = [];
            for (const otherHook of otherHooks) {
                if (!otherHook.name.startsWith((0, exports.prefix)(actor, ''))
                    && otherHook.name.endsWith((0, consts_1.UNPREFIXED_NAME_BY_ACTOR)(hook.name))) {
                    hooksPromises.push(_1.Step.run(otherHook, actor, context));
                }
            }
            await Promise.allSettled(hooksPromises);
        };
    }
    return actor;
};
exports.combine = combine;
const makeCrawlerOptions = async (actor, options) => {
    // const proxyConfiguration = proxy ? await Apify.createProxyConfiguration(proxy) : undefined;
    const proxyConfiguration = undefined;
    const preNavigationHooksList = (0, use_pre_navigation_hooks_1.default)(actor);
    const postNavigationHooksList = (0, use_post_navigation_hooks_1.default)();
    // VALIDATE INPUT
    const preNavigationHooks = [
        preNavigationHooksList.flowHook,
        preNavigationHooksList.requestHook,
        preNavigationHooksList.trailHook,
    ];
    const postNavigationHooks = [
        postNavigationHooksList.trailHook,
    ];
    const defaultOptions = {
        requestQueue: (await _1.Queue.load(actor?.queues?.default))?.resource,
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
    };
    return {
        ...defaultOptions,
        ...options,
    };
};
exports.makeCrawlerOptions = makeCrawlerOptions;
const prefix = (actor, text) => {
    return (0, consts_1.PREFIXED_NAME_BY_ACTOR)(actor.name, text);
};
exports.prefix = prefix;
const prefixSteps = (actor) => {
    return Object.keys(actor.steps).reduce((acc, key) => {
        const name = (0, exports.prefix)(actor, actor.steps[key].name);
        acc[name] = _1.Step.create({
            ...actor.steps[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {});
};
exports.prefixSteps = prefixSteps;
const prefixFlows = (actor) => {
    return Object.keys(actor.flows).reduce((acc, key) => {
        const name = (0, exports.prefix)(actor, actor.flows[key].name);
        acc[name] = _1.Flow.create({
            ...actor.flows[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {});
};
exports.prefixFlows = prefixFlows;
const prefixHooks = (actor) => {
    return Object.keys(actor.hooks).reduce((acc, key) => {
        const name = (0, exports.prefix)(actor, actor.hooks[key].name);
        acc[name] = _1.Step.create({
            ...actor.hooks[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {});
};
exports.prefixHooks = prefixHooks;
const run = async (actor, input, crawlerOptions) => {
    try {
        // Initialize actor
        actor.stores = await _1.Stores.load(actor?.stores);
        _1.Stores.listen(actor.stores);
        actor.input.data = input;
        // Hook to help with preparing the queue
        // Given a polyfilled requestQueue and the input data
        // User can add to the queue the starting requests to be crawled
        await _1.Step.run(actor?.hooks?.[(0, exports.prefix)(actor, 'ACTOR_STARTED')], actor, undefined);
        await _1.Step.run(actor?.hooks?.[(0, exports.prefix)(actor, 'QUEUE_STARTED')], actor, undefined);
        /*
       * Run async requests
       */
        const crawlerOptionsComplete = await (0, exports.makeCrawlerOptions)(actor, (crawlerOptions || {}));
        await crawler_1.default.run(actor.crawler, crawlerOptionsComplete);
        // TODO: Provider functionnalities to the end hook
        await _1.Step.run(actor?.hooks?.[(0, exports.prefix)(actor, 'QUEUE_ENDED')], actor, undefined);
        // TODO: Provider functionnalities to the end hook
        await _1.Step.run(actor?.hooks?.[(0, exports.prefix)(actor, 'ACTOR_ENDED')], actor, undefined);
    }
    catch (error) {
        _1.Logger.error(_1.Logger.create(actor), `Actor ${actor.name} failed`, { error });
    }
    finally {
        // Closing..
        await _1.Stores.persist(actor.stores);
    }
};
exports.run = run;
exports.default = { create: exports.create, extend: exports.extend, run: exports.run, prefix: exports.prefix, combine: exports.combine };
//# sourceMappingURL=actor.js.map