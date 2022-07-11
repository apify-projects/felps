import * as CONST from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import State from '@usefelps/state';
import Trail from '@usefelps/trail';
import * as FT from '@usefelps/types';

export const create = (options:  FT.TrailsOptions):  FT.TrailsInstance => {
    const { actor } = options;
    const store = (actor?.stores as FT.ReallyAny)?.trails as  FT.StateInstance;

    return {
        ...Base.create({ key: 'trails', name: 'trails' }),
        actor,
        store,
    };
};

export const getItemsList = (trails:  FT.TrailsInstance):  FT.TrailInstance[] => {
    const state = State.get(trails.store) as Record<string,  FT.TrailInstance>;
    const keys = Object.keys(state);
    return keys
        .filter((key) => key.startsWith(CONST.TRAIL_UID_PREFIX))
        .map((key) => {
            return Trail.create({ id: key, actor: trails.actor });
        });
};

export const getItems = (trails:  FT.TrailsInstance): Record<string,  FT.TrailInstance> => {
    return getItemsList(trails).reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
};

export default { create, getItems, getItemsList };
