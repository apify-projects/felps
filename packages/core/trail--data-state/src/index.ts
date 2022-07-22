/* eslint-disable max-len */
import InstanceBase from '@usefelps/instance-base';
import State from '@usefelps/state';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

export const create = (options: FT.TrailDataStateOptions): FT.TrailDataStateInstance => {
    const { id, type, state } = options;

    const key = `state-trail-data-state`;
    const name = `trail-data-model-state`;

    const path = utils.pathify(id, type, 'state');

    return {
        ...InstanceBase.create({ key, name, id }),
        path,
        state,
    };
};

export const getPath = (trailDataState: FT.TrailDataStateInstance, ...segments: string[]): string => {
    return utils.pathify(trailDataState.path, ...segments);
}

export const get = (trailDataState: FT.TrailDataStateInstance, path?: string): FT.TrailDataRequestItem => {
    return State.get<FT.TrailDataRequestItem>(trailDataState.state, utils.pathify(getPath(trailDataState), path));
};

export const set = (trailDataState: FT.TrailDataStateInstance, state: FT.ReallyAny, path?: string): void => {
    State.replace(trailDataState.state, utils.pathify(getPath(trailDataState), path), state);
};

export default { create, get, set };
