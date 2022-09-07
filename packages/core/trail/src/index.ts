import * as CONST from '@usefelps/constants';
import InstanceBase from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import State from '@usefelps/state';
import TrailDataRequests from '@usefelps/trail--data-requests';
import TrailDataState from '@usefelps/trail--data-state';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

export const create = (options: FT.TrailOptions): FT.TrailInstance => {
    const {
        id = utils.craftUIDKey(CONST.TRAIL_UID_PREFIX),
        state, // = State.create({ name: 'trails', splitByKey: true }),
    } = options || {};


    return {
        ...InstanceBase.create({ key: 'state-trail', name: 'trail', id }),
        state,
    };
};

export const load = async (trail: FT.TrailInstance): Promise<FT.TrailInstance> => {
    const state = await State.load(trail.state);

    if (!State.has(state, trail.id)) {
        const initialState: FT.DeepPartial<FT.TrailState> = {
            id: trail.id,
            flows: {},
            stats: { startedAt: new Date().toISOString() },
            status: 'ACTIVE',
        };

        State.set(state, trail.id, initialState);
    }

    return {
        ...trail,
        state,
    };
};

export const createFrom = (request: FT.RequestSource, options?: FT.TrailOptions): FT.TrailInstance => {
    const meta = RequestMeta.create(request);
    return create({
        ...(options || {}),
        id: meta.data?.[CONST.TRAIL_ID_PROP],
    });
};

export const get = (trail: FT.TrailInstance, path?: string): FT.TrailState => {
    return State.get(trail.state, utils.pathify(trail.id, path)) || {};
};

export const getMainFlow = (trail: FT.TrailInstance): FT.TrailFlowState | undefined => {
    const flows = State.get(trail.state, utils.pathify(trail.id, 'flows')) || {};
    const flowIdsOrdered = Object.keys(flows).sort(utils.compareUIDKeysFromFirst);
    return flows[flowIdsOrdered[0]];
};

export const getFlow = (trail: FT.TrailInstance, flowId: FT.UniqueyKey | undefined): FT.TrailFlowState | undefined => {
    if (!flowId) return undefined;
    return State.get(trail.state, utils.pathify(trail.id, 'flows', flowId));
};

export const setFlow = (trail: FT.TrailInstance, flowState: FT.TrailFlowState): FT.UniqueyKey => {
    const flowId = utils.craftUIDKey('flow');
    State.set(trail.state, utils.pathify(trail.id, 'flows', flowId), flowState);
    return flowId;
};

export const setRequest = (trail: FT.TrailInstance, request: any): void => {
    State.set(trail.state, utils.pathify(trail.id, 'requests', request.id), request);
};

export const setStatus = (trail: FT.TrailInstance, status: FT.TrailStateStatus): void => {
    State.set(trail.state, utils.pathify(trail.id, 'status'), status);
};

export const getStatus = (trail: FT.TrailInstance): FT.TrailStateStatus => {
    return State.get(trail.state, utils.pathify(trail.id, 'status'));
};

export const stage = (trail: FT.TrailInstance, type: FT.TrailDataStages): FT.TrailDataStage => {
    return {
        requests: TrailDataRequests.create({
            id: trail.id,
            type,
            state: trail.state,
        }),
        state: TrailDataState.create({
            id: trail.id,
            type,
            state: trail.state,
        }),
    };
};

export const ingested = (trail: FT.TrailInstance): FT.TrailDataStage => {
    return stage(trail, 'ingested');
};

export const digested = (trail: FT.TrailInstance): FT.TrailDataStage => {
    return stage(trail, 'digested');
};

export const promote = (trail: FT.TrailInstance, item: FT.TrailDataRequestItem): void => {
    const { id } = item || {};
    const path = (stageName: FT.TrailDataStages) => utils.pathify(trail.id, stageName, 'source' in item ? 'requests' : 'models', id);
    // Get current ingested item and move it to digested stage
    State.update(trail.state, path('digested'), State.get(trail.state, path('ingested')));
    // Remove it from ingested stage
    State.remove(trail.state, path('ingested'));
};

export default { create, createFrom, load, get, setRequest, getMainFlow, setFlow, getFlow, setStatus, getStatus, ingested, digested, promote };
