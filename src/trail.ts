import { RequestMeta } from '.';
import Base from './base';
import {
    DataStoreInstance,
    DeepPartial, ModelInstance, ReallyAny, RequestSource, TrailDataModelInstance, TrailDataModelItem, TrailDataRequestItem,
    TrailDataStage, TrailDataStages, TrailInstance,
    TrailOptions, TrailState,
} from './types';
import { craftUIDKey, pathify } from './utils';
import DataStore from './data-store';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';

export const create = (options: TrailOptions): TrailInstance => {
    const { id = craftUIDKey('trail'), actor } = options || {};

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
            input: {},
            output: undefined,
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
        id: meta.data?.reference?.trailKey,
    });
};

export const get = (trail: TrailInstance): TrailState => {
    return DataStore.get(trail.store, trail.id);
};

export const update = (trail: TrailInstance, data: DeepPartial<Pick<TrailState, 'input'>>): void => {
    DataStore.update(trail.store, trail.id, data);
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

export default { create, createFrom, load, get, update, setRequest, ingested, digested, promote };
