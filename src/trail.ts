import { RequestMeta } from '.';
import Base from './base';
import {
    DeepPartial, ModelsInstance, reallyAny,
    RequestSource, TrailDataStage, TrailDataStages, TrailInstance,
    TrailOptions, TrailState,
} from './common/types';
import { craftUIDKey } from './common/utils';
import DataStore from './data-store';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';

export const create = (options: TrailOptions): TrailInstance => {
    const { id = craftUIDKey('trail'), actor } = options || {};

    const store = (actor.stores as reallyAny)?.trails;
    const models = actor.models as ModelsInstance<Record<string, never>>;

    if (!DataStore.has(store, id)) {
        const initialState: DeepPartial<TrailState> = {
            id,
            query: {},
            requests: {},
            stats: { startedAt: new Date().toISOString() },
        };

        DataStore.set(store, id, initialState);
    }

    return {
        ...Base.create({ key: 'store-trail', name: 'trail' }),
        store,
        models,
    };
};

export const createFrom = (request: RequestSource, options: TrailOptions): TrailInstance => {
    const meta = RequestMeta.create(request);
    return create({
        ...options,
        id: meta.data?.reference?.trailKey,
    });
};

export const stage = (trail: TrailInstance, type: TrailDataStages): TrailDataStage => {
    return {
        models: Object.values(trail.models).reduce((acc, model) => {
            acc[model.name] = TrailDataModel.create({
                type,
                model,
                store: trail.store,
            });
            return acc;
        }, {}),
        requests: TrailDataRequests.create({
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

export default { create, createFrom, ingested, digested };
