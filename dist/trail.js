"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promote = exports.digested = exports.ingested = exports.stage = exports.setRequest = exports.setFlow = exports.getFlow = exports.get = exports.createFrom = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const data_store_1 = tslib_1.__importDefault(require("./data-store"));
const trail_data_model_1 = tslib_1.__importDefault(require("./trail-data-model"));
const trail_data_requests_1 = tslib_1.__importDefault(require("./trail-data-requests"));
const utils_1 = require("./utils");
const create = (options) => {
    const { id = (0, utils_1.craftUIDKey)('trail'), actor } = options || {};
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
exports.default = { create: exports.create, createFrom: exports.createFrom, load: exports.load, get: exports.get, setRequest: exports.setRequest, setFlow: exports.setFlow, getFlow: exports.getFlow, ingested: exports.ingested, digested: exports.digested, promote: exports.promote };
//# sourceMappingURL=trail.js.map