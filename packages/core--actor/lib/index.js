"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.prefixHookCollection = exports.prefixFlowCollection = exports.prefixStepCollection = exports.prefix = exports.makeCrawlerOptions = exports.combine = exports.extend = exports.create = void 0;
const tslib_1 = require("tslib");
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__crawler_1 = tslib_1.__importDefault(require("@usefelps/core--crawler"));
// import useHandleFailedRequestFunction from '@usefelps/core--crawler/lib/use-handle-failed-request-function';
// import useHandlePageFunction from '@usefelps/core--crawler/lib/use-handle-page-function';
// import usePostNavigationHooks from '@usefelps/core--crawler/lib/use-post-navigation-hooks';
// import usePreNavigationHooks from '@usefelps/core--crawler/lib/use-pre-navigation-hooks';
const core__dataset_collection_1 = tslib_1.__importDefault(require("@usefelps/core--dataset-collection"));
const core__flow_1 = tslib_1.__importDefault(require("@usefelps/core--flow"));
const core__flow_collection_1 = tslib_1.__importDefault(require("@usefelps/core--flow-collection"));
const core__hook_collection_1 = tslib_1.__importStar(require("@usefelps/core--hook-collection"));
const core__input_1 = tslib_1.__importDefault(require("@usefelps/core--input"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__model_collection_1 = tslib_1.__importDefault(require("@usefelps/core--model-collection"));
const core__queue_1 = tslib_1.__importDefault(require("@usefelps/core--queue"));
const core__queue_collection_1 = tslib_1.__importDefault(require("@usefelps/core--queue-collection"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__step_1 = tslib_1.__importDefault(require("@usefelps/core--step"));
const core__step_collection_1 = tslib_1.__importDefault(require("@usefelps/core--step-collection"));
const core__store_collection_1 = tslib_1.__importDefault(require("@usefelps/core--store-collection"));
const helper__logger_1 = tslib_1.__importDefault(require("@usefelps/helper--logger"));
const utils = tslib_1.__importStar(require("@usefelps/helper--utils"));
const create = (options) => {
    return {
        ...core__instance_base_1.default.create({ key: 'actor', name: options.name }),
        ...(0, exports.extend)({}, options),
    };
};
exports.create = create;
const extend = (actor, options = {}) => {
    const instance = {
        ...actor,
        name: options.name || actor.name,
        input: options?.input || core__input_1.default.create({ INPUT: { schema: { type: 'object' } } }),
        crawlerOptions: utils.merge({ mode: 'http' }, options?.crawlerOptions || {}),
        crawler: options?.crawler || actor.crawler || core__crawler_1.default.create(),
        steps: (options?.steps || actor.steps || core__step_collection_1.default.create({ STEPS: {}, INPUT: { schema: { type: 'object' } } })),
        stepApiOptions: (options?.stepApiOptions || {}),
        flows: (options?.flows || actor.flows || core__flow_collection_1.default.create({ FLOWS: {} })),
        models: options?.models || actor.models || core__model_collection_1.default.create({ MODELS: {} }),
        stores: options?.stores || actor.stores || core__store_collection_1.default.create(),
        queues: options?.queues || actor.queues || core__queue_collection_1.default.create(),
        datasets: options?.datasets || actor.datasets || core__dataset_collection_1.default.create(),
        hooks: options?.hooks || actor.hooks || core__hook_collection_1.default.create({ MODELS: {}, STEPS: {}, FLOWS: {}, INPUT: { schema: { type: 'object' } } }),
    };
    instance.steps = (0, exports.prefixStepCollection)(instance);
    instance.flows = (0, exports.prefixFlowCollection)(instance);
    instance.hooks = (0, exports.prefixHookCollection)(instance);
    return instance;
};
exports.extend = extend;
const combine = (actor, ...actors) => {
    for (const other of actors) {
        actor.flows = { ...actor.flows, ...other.flows };
        actor.steps = { ...actor.steps, ...other.steps };
        actor.hooks = { ...actor.hooks, ...other.hooks };
    }
    const mainHookCollection = Object
        .keys(actor.hooks)
        .filter((key) => key.startsWith((0, exports.prefix)(actor, '')) && core__hook_collection_1.globalHookNames.some((name) => key.endsWith(name)))
        .map((key) => actor.hooks[key]);
    const otherHookCollection = Object
        .keys(actor.hooks)
        .filter((key) => !key.startsWith((0, exports.prefix)(actor, '')) && core__hook_collection_1.globalHookNames.some((name) => key.endsWith(name)))
        .map((key) => actor.hooks[key]);
    // Propagate hooks to other actors
    for (const hook of mainHookCollection) {
        hook.afterHandler = async (context) => {
            const hooksPromises = [];
            for (const otherHook of otherHookCollection) {
                if (!otherHook.name.startsWith((0, exports.prefix)(actor, ''))
                    && otherHook.name.endsWith(CONST.UNPREFIXED_NAME_BY_ACTOR(hook.name))) {
                    hooksPromises.push(core__step_1.default.run(otherHook, actor, core__request_meta_1.default.cloneContext(context)));
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
    // const preNavigationHooksList = usePreNavigationHooks(actor);
    // const postNavigationHooksList = usePostNavigationHooks();
    // VALIDATE INPUT
    const preNavigationHooks = [
    // preNavigationHooksList.flowHook,
    // preNavigationHooksList.requestHook,
    // preNavigationHooksList.trailHook,
    ];
    const postNavigationHooks = [
    // postNavigationHooksList.trailHook,
    ];
    const defaultOptions = {
        handlePageTimeoutSecs: 120,
        navigationTimeoutSecs: 60,
        maxConcurrency: 40,
        maxRequestRetries: 3,
        requestQueue: (await core__queue_1.default.load(actor?.queues?.default))?.resource,
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
    return utils.merge(defaultOptions, options);
};
exports.makeCrawlerOptions = makeCrawlerOptions;
const prefix = (actor, text) => {
    return CONST.PREFIXED_NAME_BY_ACTOR(actor.name, text);
};
exports.prefix = prefix;
const prefixStepCollection = (actor) => {
    return Object.keys(actor.steps).reduce((acc, key) => {
        const name = (0, exports.prefix)(actor, actor.steps[key].name);
        acc[name] = core__step_1.default.create({
            ...actor.steps[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {});
};
exports.prefixStepCollection = prefixStepCollection;
const prefixFlowCollection = (actor) => {
    return Object.keys(actor.flows).reduce((acc, key) => {
        const name = (0, exports.prefix)(actor, actor.flows[key].name);
        acc[name] = core__flow_1.default.create({
            ...actor.flows[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {});
};
exports.prefixFlowCollection = prefixFlowCollection;
const prefixHookCollection = (actor) => {
    return Object.keys(actor.hooks).reduce((acc, key) => {
        const name = (0, exports.prefix)(actor, actor.hooks[key].name);
        acc[name] = core__step_1.default.create({
            ...actor.hooks[key],
            name,
            actorKey: actor.name,
        });
        return acc;
    }, {});
};
exports.prefixHookCollection = prefixHookCollection;
const run = async (actor, input, crawlerOptions) => {
    const startedAt = new Date().getTime();
    try {
        // Initialize actor
        actor.stores = await core__store_collection_1.default.load(actor?.stores);
        core__store_collection_1.default.listen(actor.stores);
        actor.input.data = input;
        // Hook to help with preparing the queue
        // Given a polyfilled requestQueue and the input data
        // User can add to the queue the starting requests to be crawled
        await core__step_1.default.run(actor?.hooks?.[(0, exports.prefix)(actor, 'ACTOR_STARTED')], actor, undefined);
        await core__step_1.default.run(actor?.hooks?.[(0, exports.prefix)(actor, 'QUEUE_STARTED')], actor, undefined);
        /*
       * Run async requests
       */
        const crawlerOptionsComplete = await (0, exports.makeCrawlerOptions)(actor, (crawlerOptions || {}));
        await core__crawler_1.default.run(actor.crawler, crawlerOptionsComplete);
        // TODO: Provider functionnalities to the end hook
        await core__step_1.default.run(actor?.hooks?.[(0, exports.prefix)(actor, 'QUEUE_ENDED')], actor, undefined);
        // TODO: Provider functionnalities to the end hook
        await core__step_1.default.run(actor?.hooks?.[(0, exports.prefix)(actor, 'ACTOR_ENDED')], actor, undefined);
    }
    catch (error) {
        helper__logger_1.default.error(helper__logger_1.default.create(actor), `Actor ${actor.name} failed`, { error });
    }
    finally {
        // Closing..
        await core__store_collection_1.default.persist(actor.stores);
        await core__dataset_collection_1.default.close(actor.datasets);
        const duration = new Date().getTime() - startedAt;
        helper__logger_1.default.info(helper__logger_1.default.create(actor), `Actor ${actor.name} finished in ${duration}ms`);
        // Logger.info(Logger.create(actor), `Actor ${actor.name} finished in ${duration}ms (${duration / (3600 * 1000)} CUs)`);
    }
};
exports.run = run;
exports.default = { create: exports.create, extend: exports.extend, run: exports.run, prefix: exports.prefix, combine: exports.combine };
//# sourceMappingURL=index.js.map