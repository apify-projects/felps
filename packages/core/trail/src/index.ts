import * as CONST from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import Model from '@usefelps/model';
import RequestMeta from '@usefelps/request-meta';
import State from '@usefelps/state';
import TrailDataModel from '@usefelps/trail--data-model';
import TrailDataRequests from '@usefelps/trail--data-requests';
import * as utils from '@usefelps/utils';
import * as FT from '@usefelps/types';

export const create = (options: FT.TrailOptions): FT.TrailInstance => {
    const {
        id = utils.craftUIDKey(CONST.TRAIL_UID_PREFIX),
        store = State.create({ name: 'trails' }),
        actor
    } = options || {};

    const models = actor?.models;

    return {
        ...Base.create({ key: 'store-trail', name: 'trail', id }),
        store,
        models,
    };
};

export const load = async (trail: FT.TrailInstance): Promise<FT.TrailInstance> => {
    const store = await State.load(trail.store);

    if (!State.has(store, trail.id)) {
        const initialState: FT.DeepPartial<FT.TrailState> = {
            id: trail.id,
            flows: {},
            stats: { startedAt: new Date().toISOString() },
        };

        State.set(store, trail.id, initialState);
    }

    return {
        ...trail,
        store,
    };
};

export const createFrom = (request: FT.RequestSource, options: FT.TrailOptions): FT.TrailInstance => {
    const meta = RequestMeta.create(request);
    return create({
        ...options,
        id: meta.data?.reference?.[CONST.TRAIL_KEY_PROP],
    });
};

export const get = (trail: FT.TrailInstance): FT.TrailState => {
    return State.get(trail.store, trail.id);
};

// export const update = (trail: TrailInstance, data: DeepPartial<Pick<TrailState, 'flows'>>): void => {
//     State.update(trail.store, trail.id, data);
// };
export const getMainFlow = (trail: FT.TrailInstance): FT.TrailFlowState | undefined => {
    const flows = State.get(trail.store, utils.pathify(trail.id, 'flows')) || {};
    const flowKeysOrdered = Object.keys(flows).sort(utils.compareUIDKeysFromFirst);
    return flows[flowKeysOrdered[0]];
};

export const getFlow = (trail: FT.TrailInstance, flowKey: FT.UniqueyKey | undefined): FT.TrailFlowState | undefined => {
    if (!flowKey) return undefined;
    return State.get(trail.store, utils.pathify(trail.id, 'flows', flowKey));
};

export const setFlow = (trail: FT.TrailInstance, flowState: FT.TrailFlowState): FT.UniqueyKey => {
    const flowKey = utils.craftUIDKey('flow');
    State.set(trail.store, utils.pathify(trail.id, 'flows', flowKey), flowState);
    return flowKey;
};

export const setRequest = (trail: FT.TrailInstance, request: any): void => {
    State.set(trail.store, utils.pathify(trail.id, 'requests', request.id), request);
};

export const stage = (trail: FT.TrailInstance, type: FT.TrailDataStages): FT.TrailDataStage => {
    return {
        models: Object.values(trail.models as Record<string, FT.ModelInstance>).reduce<Record<string, FT.TrailDataModelInstance>>((acc, model) => {
            acc[model.name] = TrailDataModel.create({
                id: trail.id,
                type,
                model,
                store: trail.store,
            });
            return acc;
        }, {}),
        requests: TrailDataRequests.create({
            id: trail.id,
            type,
            store: trail.store,
        }),
    };
};

export const modelOfStage = (trailStage: FT.TrailDataStage, modelName: string): FT.TrailDataModelInstance => {
    const model = trailStage.models?.[modelName];
    if (!model) throw new Error(`Model ${modelName} not found in stage`);
    return model;
};

export const ingested = (trail: FT.TrailInstance): FT.TrailDataStage => {
    return stage(trail, 'ingested');
};

export const digested = (trail: FT.TrailInstance): FT.TrailDataStage => {
    return stage(trail, 'digested');
};

export const promote = (trail: FT.TrailInstance, item: FT.TrailDataModelItem | FT.TrailDataRequestItem): void => {
    const { id } = item || {};
    const path = (stageName: FT.TrailDataStages) => utils.pathify(trail.id, stageName, 'source' in item ? 'requests' : 'models', id);
    // Get current ingested item and move it to digested stage
    State.update(trail.store, path('digested'), State.get(trail.store, path('ingested')));
    // Remove it from ingested stage
    State.remove(trail.store, path('ingested'));
};

export const getEntities = (trail: FT.TrailInstance, modelName: string, ref?: FT.ModelReference): FT.TrailDataModelItem[] => {
    const digest = digested(trail);
    const digestModel = digest.models[modelName];
    // HAAACKY
    const models = Model.flatten(digestModel.model);
    const model = models.find((m) => m.name === modelName);
    const reference = Model.referenceFor(model as FT.ModelInstance, ref as FT.ModelReference, { withOwnReferenceKey: true, includeNotFound: false });
    return TrailDataModel.getItemsList(digestModel, reference);
};

export const resolve = <T = unknown>(trail: FT.TrailInstance, model: FT.ModelInstance): T | undefined => {
    const models = Model.flatten(model);
    // console.log(models);

    const data = { root: undefined } as FT.ReallyAny;

    const orderByKeys = (keys: string[], obj: FT.ReallyAny) => keys.reduce((acc, key) => {
        if (key in obj) return { ...acc, [key]: obj[key] };
        return acc;
    }, {});

    const processedModel = new Set();

    const reducer = (obj: FT.ReallyAny, modelName: string | undefined, ref: FT.ModelReference) => {
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
            if (child.name === 'PAGE') obj = obj[0];
            const path = child.parentPath || 'root';

            const { resolveList } = (child.schema || {}) as FT.JSONSchemaMethods;

            // console.log('resolveList', resolveList)

            if (resolveList) {
                const resolvedList = resolveList(ref, {
                    getEntities(_modelName, _ref = {}) {
                        return getEntities(trail, _modelName, _ref);
                    },
                });
                // console.log('resolvedList', resolvedList);

                utils.set(obj, path, resolvedList);
                // Stop early as we resolve the list differently
                return;
            }

            const entities = getEntities(trail, child.name, ref);
            // console.log({ entities });
            if (!entities.length) continue;

            if (child.parentType === 'array') {
                const arr = [];
                for (const entity of entities) {
                    const entityObj = { ...orderByKeys(Object.keys((child.schema as FT.ReallyAny)?.properties), entity.data || {}) };
                    // const idx =
                    arr.push(entityObj);
                    // console.log('reduce', obj, utils.get(obj, `${path}.${idx}`), child.name, entity.reference);
                    reducer(entityObj, child.name, entity.reference);
                }
                utils.set(obj, path, arr);
            } else {
                const entity = entities?.[0];
                utils.set(obj, path, orderByKeys(Object.keys((child.schema as FT.ReallyAny)?.properties), entity.data || {}));
                // console.log('reduce', path, obj, child.name, entity.reference);
                reducer(utils.get(obj, path), child.name, entity.reference);
            }

            reducer(utils.get(obj, path), child.name, {});
        }
    };

    reducer(data, undefined, {});

    return data.root;
};

export default { create, createFrom, load, get, setRequest, getMainFlow, setFlow, getFlow, ingested, digested, modelOfStage, promote, resolve, getEntities };
