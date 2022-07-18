import Trail from '@usefelps/trail';
import InstanceBase from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
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
                getActorInput: () => actor.input,
                getUserData: () => meta.userData || {},
                getMetaData: () => meta.data || {},
                getFlowName: () => meta.data.flowName,
                getStepName: () => meta.data.stepName,
                getFlowInput: () => Trail.getFlow(trail, meta.data.flowId)?.input || {},
                getContext: () => context,
            } as FT.ContextApiMetaAPI;
        },
    };
};

export default { create };
