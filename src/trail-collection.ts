import { Base, DataStore, Trail } from '.';
import { TRAIL_UID_PREFIX } from './consts';
import { DataStoreInstance, ReallyAny, TrailInstance, TrailsInstance, TrailsOptions } from './types';

export const create = (options: TrailsOptions): TrailsInstance => {
    const { actor } = options;
    const store = (actor?.stores as ReallyAny)?.trails as DataStoreInstance;

    return {
        ...Base.create({ key: 'trails', name: 'trails' }),
        actor,
        store,
    };
};

export const getItemsList = (trails: TrailsInstance): TrailInstance[] => {
    const state = DataStore.get(trails.store) as Record<string, TrailInstance>;
    const keys = Object.keys(state);
    return keys
        .filter((key) => key.startsWith(TRAIL_UID_PREFIX))
        .map((key) => {
            return Trail.create({ id: key, actor: trails.actor });
        });
};

export const getItems = (trails: TrailsInstance): Record<string, TrailInstance> => {
    return getItemsList(trails).reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
};

export default { create, getItems, getItemsList };
