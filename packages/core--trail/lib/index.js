"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = exports.getEntities = exports.promote = exports.digested = exports.ingested = exports.modelOfStage = exports.stage = exports.setRequest = exports.setFlow = exports.getFlow = exports.getMainFlow = exports.get = exports.createFrom = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__model_1 = tslib_1.__importDefault(require("@usefelps/core--model"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__store__data_1 = tslib_1.__importDefault(require("@usefelps/core--store--data"));
const core__trail__data_model_1 = tslib_1.__importDefault(require("@usefelps/core--trail--data-model"));
const core__trail__data_requests_1 = tslib_1.__importDefault(require("@usefelps/core--trail--data-requests"));
const utils = tslib_1.__importStar(require("@usefelps/helper--utils"));
const create = (options) => {
    const { id = utils.craftUIDKey(CONST.TRAIL_UID_PREFIX), actor } = options || {};
    const store = actor?.stores?.trails;
    const models = actor?.models;
    return {
        ...core__instance_base_1.default.create({ key: 'store-trail', name: 'trail', id }),
        store,
        models,
    };
};
exports.create = create;
const load = async (trail) => {
    const store = await core__store__data_1.default.load(trail.store);
    if (!core__store__data_1.default.has(store, trail.id)) {
        const initialState = {
            id: trail.id,
            flows: {},
            stats: { startedAt: new Date().toISOString() },
        };
        core__store__data_1.default.set(store, trail.id, initialState);
    }
    return {
        ...trail,
        store,
    };
};
exports.load = load;
const createFrom = (request, options) => {
    const meta = core__request_meta_1.default.create(request);
    return (0, exports.create)({
        ...options,
        id: meta.data?.reference?.[CONST.TRAIL_KEY_PROP],
    });
};
exports.createFrom = createFrom;
const get = (trail) => {
    return core__store__data_1.default.get(trail.store, trail.id);
};
exports.get = get;
// export const update = (trail: TrailInstance, data: DeepPartial<Pick<TrailState, 'flows'>>): void => {
//     DataStore.update(trail.store, trail.id, data);
// };
const getMainFlow = (trail) => {
    const flows = core__store__data_1.default.get(trail.store, utils.pathify(trail.id, 'flows')) || {};
    const flowKeysOrdered = Object.keys(flows).sort(utils.compareUIDKeysFromFirst);
    return flows[flowKeysOrdered[0]];
};
exports.getMainFlow = getMainFlow;
const getFlow = (trail, flowKey) => {
    if (!flowKey)
        return undefined;
    return core__store__data_1.default.get(trail.store, utils.pathify(trail.id, 'flows', flowKey));
};
exports.getFlow = getFlow;
const setFlow = (trail, flowState) => {
    const flowKey = utils.craftUIDKey('flow');
    core__store__data_1.default.set(trail.store, utils.pathify(trail.id, 'flows', flowKey), flowState);
    return flowKey;
};
exports.setFlow = setFlow;
const setRequest = (trail, request) => {
    core__store__data_1.default.set(trail.store, utils.pathify(trail.id, 'requests', request.id), request);
};
exports.setRequest = setRequest;
const stage = (trail, type) => {
    return {
        models: Object.values(trail.models).reduce((acc, model) => {
            acc[model.name] = core__trail__data_model_1.default.create({
                id: trail.id,
                type,
                model,
                store: trail.store,
            });
            return acc;
        }, {}),
        requests: core__trail__data_requests_1.default.create({
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
    const path = (stageName) => utils.pathify(trail.id, stageName, 'source' in item ? 'requests' : 'models', id);
    // Get current ingested item and move it to digested stage
    core__store__data_1.default.update(trail.store, path('digested'), core__store__data_1.default.get(trail.store, path('ingested')));
    // Remove it from ingested stage
    core__store__data_1.default.remove(trail.store, path('ingested'));
};
exports.promote = promote;
const getEntities = (trail, modelName, ref) => {
    const digest = (0, exports.digested)(trail);
    const digestModel = digest.models[modelName];
    // HAAACKY
    const models = core__model_1.default.flatten(digestModel.model);
    const model = models.find((m) => m.name === modelName);
    const reference = core__model_1.default.referenceFor(model, ref, { withOwnReferenceKey: true, includeNotFound: false });
    return core__trail__data_model_1.default.getItemsList(digestModel, reference);
};
exports.getEntities = getEntities;
const resolve = (trail, model) => {
    const models = core__model_1.default.flatten(model);
    // console.log(models);
    const data = { root: undefined };
    const orderByKeys = (keys, obj) => keys.reduce((acc, key) => {
        if (key in obj)
            return { ...acc, [key]: obj[key] };
        return acc;
    }, {});
    const processedModel = new Set();
    const reducer = (obj, modelName, ref) => {
        const childModels = models.filter((m) => m.parents?.reverse?.()?.[0] === modelName); //
        // console.log({ childModels });
        for (const child of childModels) {
            if (processedModel.has(child.name)) {
                // hacky skip
                return;
            }
            processedModel.add(child.name);
            // console.log('processedModel', modelName, child.name, obj)
            // TODO: Fix here, dirty fix
            if (child.name === 'PAGE')
                obj = obj[0];
            const path = child.parentPath || 'root';
            const { resolveList } = (child.schema || {});
            // console.log('resolveList', resolveList)
            if (resolveList) {
                const resolvedList = resolveList(ref, {
                    getEntities(_modelName, _ref = {}) {
                        return (0, exports.getEntities)(trail, _modelName, _ref);
                    },
                });
                // console.log('resolvedList', resolvedList);
                utils.set(obj, path, resolvedList);
                // Stop early as we resolve the list differently
                return;
            }
            const entities = (0, exports.getEntities)(trail, child.name, ref);
            // console.log({ entities });
            if (!entities.length)
                continue;
            if (child.parentType === 'array') {
                const arr = [];
                for (const entity of entities) {
                    const entityObj = { ...orderByKeys(Object.keys(child.schema?.properties), entity.data || {}) };
                    // const idx =
                    arr.push(entityObj);
                    // console.log('reduce', obj, utils.get(obj, `${path}.${idx}`), child.name, entity.reference);
                    reducer(entityObj, child.name, entity.reference);
                }
                utils.set(obj, path, arr);
            }
            else {
                const entity = entities?.[0];
                utils.set(obj, path, orderByKeys(Object.keys(child.schema?.properties), entity.data || {}));
                // console.log('reduce', path, obj, child.name, entity.reference);
                reducer(utils.get(obj, path), child.name, entity.reference);
            }
            reducer(utils.get(obj, path), child.name, {});
        }
    };
    reducer(data, undefined, {});
    return data.root;
};
exports.resolve = resolve;
exports.default = { create: exports.create, createFrom: exports.createFrom, load: exports.load, get: exports.get, setRequest: exports.setRequest, getMainFlow: exports.getMainFlow, setFlow: exports.setFlow, getFlow: exports.getFlow, ingested: exports.ingested, digested: exports.digested, modelOfStage: exports.modelOfStage, promote: exports.promote, resolve: exports.resolve, getEntities: exports.getEntities };
//# sourceMappingURL=index.js.map