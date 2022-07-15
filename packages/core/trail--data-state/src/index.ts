/* eslint-disable max-len */
import Base from '@usefelps/instance-base';
import State from '@usefelps/state';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

export const create = (options: FT.TrailDataStateOptions): FT.TrailDataStateInstance => {
    const { id, type, state } = options;

    const key = `state-trail-data-state`;
    const name = `trail-data-model-state`;

    const path = utils.pathify(id, type, 'state');

    return {
        ...Base.create({ key, name, id }),
        path,
        state,
    };
};

export const getPath = (trailDataState: FT.TrailDataStateInstance, ...segments: string[]): string => {
    return utils.pathify(trailDataState.path, ...segments);
}

export const get = (trailDataState: FT.TrailDataStateInstance): FT.TrailDataRequestItem => {
    return State.get<FT.TrailDataRequestItem>(trailDataState.state, getPath(trailDataState));
};

export const set = (trailDataState: FT.TrailDataStateInstance, state: FT.ReallyAny): void => {
    State.replace(trailDataState.state, getPath(trailDataState), state);
};

export default { create, get, set };
