import setPath from 'lodash.set';
import getPath from 'lodash.get';
import { Model, RequestMeta } from '.';
import Base from './base';
import { TRAIL_KEY_PROP, TRAIL_UID_PREFIX } from './consts';
import DataStore from './data-store';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';
import {
    DataStoreInstance,
    DeepPartial, ModelInstance, ModelReference, ReallyAny, RequestSource, TrailDataModelInstance, TrailDataModelItem, TrailDataRequestItem,
    TrailDataStage, TrailDataStages, TrailFlowState, TrailInstance,
    TrailOptions, TrailState, UniqueyKey,
} from './types';
import { craftUIDKey, pathify } from './utils';

export const create = (options: TrailOptions): TrailInstance => {
    const { id = craftUIDKey(TRAIL_UID_PREFIX), actor } = options || {};

    const store = (actor?.stores as ReallyAny)?.trails as DataStoreInstance;
    const models = actor?.models;

    return {
        ...Base.create({ key: 'store-trail', name: 'trail', id }),
        store,
        models,
    };
};

export const load = async (trail: TrailInstance): Promise<TrailInstance> => {
    const store = await DataStore.load(trail.store);

    if (!DataStore.has(store, trail.id)) {
        const initialState: DeepPartial<TrailState> = {
            id: trail.id,
            flows: {},
            stats: { startedAt: new Date().toISOString() },
        };

        DataStore.set(store, trail.id, initialState);
    }

    return {
        ...trail,
        store,
    };
};

export const createFrom = (request: RequestSource, options: TrailOptions): TrailInstance => {
    const meta = RequestMeta.create(request);
    return create({
        ...options,
        id: meta.data?.reference?.[TRAIL_KEY_PROP],
    });
};

export const get = (trail: TrailInstance): TrailState => {
    return DataStore.get(trail.store, trail.id);
};

// export const update = (trail: TrailInstance, data: DeepPartial<Pick<TrailState, 'flows'>>): void => {
//     DataStore.update(trail.store, trail.id, data);
// };

export const getFlow = (trail: TrailInstance, flowKey: UniqueyKey | undefined): TrailFlowState | undefined => {
    if (!flowKey) return;
    return DataStore.get(trail.store, pathify(trail.id, 'flows', flowKey));
};

export const setFlow = (trail: TrailInstance, flowState: TrailFlowState): UniqueyKey => {
    const flowKey = craftUIDKey('flow');
    DataStore.set(trail.store, pathify(trail.id, 'flows', flowKey), flowState);
    return flowKey;
};

export const setRequest = (trail: TrailInstance, request: any): void => {
    DataStore.set(trail.store, pathify(trail.id, 'requests', request.id), request);
};

export const stage = (trail: TrailInstance, type: TrailDataStages): TrailDataStage => {
    return {
        models: Object.values(trail.models as Record<string, ModelInstance>).reduce<Record<string, TrailDataModelInstance>>((acc, model) => {
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

export const modelOfStage = (trailStage: TrailDataStage, modelName: string): TrailDataModelInstance => {
    const model = trailStage.models?.[modelName];
    if (!model) throw new Error(`Model ${modelName} not found in stage`);
    return model;
};

export const ingested = (trail: TrailInstance): TrailDataStage => {
    return stage(trail, 'ingested');
};

export const digested = (trail: TrailInstance): TrailDataStage => {
    return stage(trail, 'digested');
};

export const promote = (trail: TrailInstance, item: TrailDataModelItem | TrailDataRequestItem): void => {
    const { id } = item || {};
    const path = (stageName: TrailDataStages) => pathify(trail.id, stageName, 'source' in item ? 'requests' : 'models', id);
    // Get current ingested item and move it to digested stage
    DataStore.update(trail.store, path('digested'), DataStore.get(trail.store, path('ingested')));
    // Remove it from ingested stage
    DataStore.remove(trail.store, path('ingested'));
};

export const resolve = <T = unknown>(trail: TrailInstance, model: ModelInstance): T | undefined => {
    const digest = digested(trail);

    const getEntities = (modelName: string, ref: ModelReference) => {
        const digestModel = digest.models[modelName];
        return TrailDataModel.getItemsList(digestModel, ref);
    };

    const models = Model.flatten(model);
    // console.log(models);

    const data = { root: undefined } as ReallyAny;

    const orderByKeys = (keys: string[], obj: ReallyAny) => keys.reduce((acc, key) => {
        if (key in obj) return { ...acc, [key]: obj[key] };
        return acc;
    }, {});

    const reducer = (obj: ReallyAny, modelName: string | undefined, ref: ModelReference) => {
        const childModels = models.filter((m) => m.parents?.reverse()[0] === modelName);
        // console.log({ childModels });

        for (const child of childModels) {
            const path = child.parentPath || 'root';
            const entities = getEntities(child.name, ref);
            // console.log({ entities });
            if (!entities.length) continue;

            if (child.parentType === 'array') {
                setPath(obj, path, []);
                const arr = getPath(obj, path);
                for (const entity of entities) {
                    const idx = arr.push(orderByKeys(Object.keys((child.schema as ReallyAny)?.properties), entity.data || {})) - 1;
                    // console.log('reduce', arr[idx], child.name, entity.reference);
                    reducer(arr[idx], child.name, entity.reference);
                }
            } else {
                const entity = entities?.[0];
                setPath(obj, path, orderByKeys(Object.keys((child.schema as ReallyAny)?.properties), entity.data || {}));
                // console.log('reduce', path, obj, child.name, entity.reference);
                reducer(getPath(obj, path), child.name, entity.reference);
            }

            reducer(getPath(obj, path), child.name, {});
        }
    };

    reducer(data, undefined, {});

    return data.root;
};

export default { create, createFrom, load, get, setRequest, setFlow, getFlow, ingested, digested, modelOfStage, promote, resolve };
