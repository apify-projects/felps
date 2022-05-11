"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = exports.promote = exports.digested = exports.ingested = exports.modelOfStage = exports.stage = exports.setRequest = exports.setFlow = exports.getFlow = exports.get = exports.createFrom = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const data_store_1 = tslib_1.__importDefault(require("./data-store"));
const trail_data_model_1 = tslib_1.__importDefault(require("./trail-data-model"));
const trail_data_requests_1 = tslib_1.__importDefault(require("./trail-data-requests"));
const utils_1 = require("./utils");
const create = (options) => {
    const { id = (0, utils_1.craftUIDKey)(consts_1.TRAIL_UID_PREFIX), actor } = options || {};
    const store = actor?.stores?.trails;
    const models = actor?.models;
    return {
        ...base_1.default.create({ key: 'store-trail', name: 'trail', id }),
        store,
        models,
    };
};
exports.create = create;
const load = async (trail) => {
    const store = await data_store_1.default.load(trail.store);
    if (!data_store_1.default.has(store, trail.id)) {
        const initialState = {
            id: trail.id,
            flows: {},
            stats: { startedAt: new Date().toISOString() },
        };
        data_store_1.default.set(store, trail.id, initialState);
    }
    return {
        ...trail,
        store,
    };
};
exports.load = load;
const createFrom = (request, options) => {
    const meta = _1.RequestMeta.create(request);
    return (0, exports.create)({
        ...options,
        id: meta.data?.reference?.[consts_1.TRAIL_KEY_PROP],
    });
};
exports.createFrom = createFrom;
const get = (trail) => {
    return data_store_1.default.get(trail.store, trail.id);
};
exports.get = get;
// export const update = (trail: TrailInstance, data: DeepPartial<Pick<TrailState, 'flows'>>): void => {
//     DataStore.update(trail.store, trail.id, data);
// };
const getFlow = (trail, flowKey) => {
    if (!flowKey)
        return;
    return data_store_1.default.get(trail.store, (0, utils_1.pathify)(trail.id, 'flows', flowKey));
};
exports.getFlow = getFlow;
const setFlow = (trail, flowState) => {
    const flowKey = (0, utils_1.craftUIDKey)('flow');
    data_store_1.default.set(trail.store, (0, utils_1.pathify)(trail.id, 'flows', flowKey), flowState);
    return flowKey;
};
exports.setFlow = setFlow;
const setRequest = (trail, request) => {
    data_store_1.default.set(trail.store, (0, utils_1.pathify)(trail.id, 'requests', request.id), request);
};
exports.setRequest = setRequest;
const stage = (trail, type) => {
    return {
        models: Object.values(trail.models).reduce((acc, model) => {
            acc[model.name] = trail_data_model_1.default.create({
                id: trail.id,
                type,
                model,
                store: trail.store,
            });
            return acc;
        }, {}),
        requests: trail_data_requests_1.default.create({
            id: trail.id,
            type,
            store: trail.store,
        }),
    };
};
exports.stage = stage;
const modelOfStage = (trailStage, modelName) => {
    const model = trailStage.models?.[modelName];
    if (!model)
        throw new Error(`Model ${modelName} not found in stage`);
    return model;
};
exports.modelOfStage = modelOfStage;
const ingested = (trail) => {
    return (0, exports.stage)(trail, 'ingested');
};
exports.ingested = ingested;
const digested = (trail) => {
    return (0, exports.stage)(trail, 'digested');
};
exports.digested = digested;
const promote = (trail, item) => {
    const { id } = item || {};
    const path = (stageName) => (0, utils_1.pathify)(trail.id, stageName, 'source' in item ? 'requests' : 'models', id);
    // Get current ingested item and move it to digested stage
    data_store_1.default.update(trail.store, path('digested'), data_store_1.default.get(trail.store, path('ingested')));
    // Remove it from ingested stage
    data_store_1.default.remove(trail.store, path('ingested'));
};
exports.promote = promote;
const resolve = (trail, model) => {
    const digest = (0, exports.digested)(trail);
    const getEntities = (modelName, ref) => {
        const digestModel = digest.models[modelName];
        return trail_data_model_1.default.getItemsList(digestModel, ref);
    };
    const models = _1.Model.flatten(model);
    // console.log(models);
    const data = { root: undefined };
    const orderByKeys = (keys, obj) => keys.reduce((acc, key) => {
        if (key in obj)
            return { ...acc, [key]: obj[key] };
        return acc;
    }, {});
    const reducer = (obj, modelName, ref) => {
        const childModels = models.filter((m) => m.parents?.reverse()[0] === modelName);
        // console.log({ childModels });
        for (const child of childModels) {
            const key = child.parentKey || 'root';
            const entities = getEntities(child.name, ref);
            // console.log({ entities });
            if (!entities.length)
                continue;
            if (child.parentType === 'array') {
                for (const entity of entities) {
                    const idx = obj[key].push(orderByKeys(Object.keys(child.schema?.properties), entity.data || {})) - 1;
                    reducer(obj[key][idx], child.name, entity.reference);
                }
            }
            else {
                const entity = entities?.[0];
                obj[key] = orderByKeys(Object.keys(child.schema?.properties), entity.data || {});
                reducer(obj[key], child.name, entity.reference);
            }
            reducer(obj[key], child.name, {});
        }
    };
    reducer(data, undefined, {});
    return data.root;
};
exports.resolve = resolve;
exports.default = { create: exports.create, createFrom: exports.createFrom, load: exports.load, get: exports.get, setRequest: exports.setRequest, setFlow: exports.setFlow, getFlow: exports.getFlow, ingested: exports.ingested, digested: exports.digested, modelOfStage: exports.modelOfStage, promote: exports.promote, resolve: exports.resolve };
//# sourceMappingURL=trail.js.map