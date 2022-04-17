import { DeepPartial, TrailInstance, TrailOptions, TrailState } from './common/types';
import { craftUIDKey } from './common/utils';
import Base from './base';
import dataStore from './data-store';

export const create = (options: TrailOptions): TrailInstance => {
    const { id = craftUIDKey('trail'), store, models } = options || {};

    if (!dataStore.has(store, id)) {
        const initialState: DeepPartial<TrailState> = {
            id,
            query: {},
            requests: {},
            stats: { startedAt: new Date().toISOString() },
        };

        dataStore.set(id, initialState);
    }

    return {
        ...Base.create({ key: 'store-trail', name: 'trail' }),
        store,
        models,
    };
};

// export const ingested = (trail: TrailInstance): void => {
//     const _ingested = Object.values(trail.models).reduce((acc, model) => {
//         acc[model.name] = makeTrailInOutMethods<ModelDefinitions>({
//             name: model.name, path: 'ingested',
//             store: trail.store, model, methods: _ingested
//         });
//         return acc;
//     }, {} as GenerateObject<keyof ModelDefinitions, TrailInOutMethods>);
//     return _ingested;
// };

// export const digested = (trail: TrailInstance): void => {
//     const _digested = Object.values(trail.models).reduce((acc, model) => {
//         acc[model.name] = makeTrailInOutMethods<ModelDefinitions>({ name: model.name, path: 'ingested', store: trail.store, model, methods: _digested });
//         return acc;
//     }, {} as GenerateObject<keyof ModelDefinitions, TrailInOutMethods>);
//     return _digested;
// };

export default { create };
