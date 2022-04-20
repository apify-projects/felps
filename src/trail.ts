import { RequestMeta } from '.';
import Base from './base';
import {
    DeepPartial, ModelsInstance, reallyAny,
    RequestSource, TrailDataStage, TrailDataStages, TrailInstance,
    TrailOptions, TrailState,
} from './common/types';
import { craftUIDKey, pathify } from './common/utils';
import DataStore from './data-store';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';

export const create = (options: TrailOptions): TrailInstance => {
    const { id = craftUIDKey('trail'), actor } = options || {};

    const store = (actor.stores as reallyAny)?.trails;
    const models = actor.models as ModelsInstance<Record<string, never>>;

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
            requests: {},
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

export const update = (trail: TrailInstance, data: DeepPartial<Pick<TrailState, 'input' | 'status'>>): void => {
    DataStore.update(trail.store, trail.id, data);
};

// export const setStep = (trail: TrailInstance, id: UniqueyKey, data: reallyAny): void => {
//     DataStore.set(trail.store, pathify(trail.id, 'steps', id), data);
// };

export const setRequest = (trail: TrailInstance, request: any): void => {
    DataStore.set(trail.store, pathify(trail.id, 'requests', request.id), request);
};

export const stage = (trail: TrailInstance, type: TrailDataStages): TrailDataStage => {
    return {
        models: Object.values(trail.models).reduce((acc, model) => {
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

export default { create, createFrom, load, update, setRequest, ingested, digested };
