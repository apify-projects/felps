import Trail from '@usefelps/trail';
import InstanceBase from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import * as CONST from '@usefelps/constants';
import * as FT from '@usefelps/types';

export const create = (actor: FT.ActorInstance): FT.ContextApiMetaInstance => {
    return {
        ...InstanceBase.create({ key: 'context-api-meta', name: 'context-api-meta' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { state: actor?.stores?.trails as FT.StateInstance });
            const meta = RequestMeta.create(context);

            return {
                getActor: () => actor,
                getActorName: () => meta.data.actorName,
                getActorData: () => actor?.data,
                getActorInput: () => actor.input,
                getUserData: () => meta.userData || {},
                getMetaData: () => meta.data || {},
                getFlow: () => actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(meta.data.actorName, CONST.UNPREFIXED_NAME_BY_ACTOR(meta.data.flowName))],
                getFlowName: () => meta.data.flowName,
                getFlowInput: () => Trail.getFlow(trail, meta.data.flowId)?.input || {},
                getStepName: () => meta.data.stepName,
                getStep: () =>  actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(meta.data.actorName, CONST.UNPREFIXED_NAME_BY_ACTOR(meta.data.stepName))],
                getContext: () => context,
            } as FT.ContextApiMetaAPI;
        },
    };
};

export default { create };
