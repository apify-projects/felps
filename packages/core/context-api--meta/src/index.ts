import { FLOW_KEY_PROP } from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import Trail from '@usefelps/trail';
import { ActorInstance, ContextApiMetaAPI, ContextApiMetaInstance } from '@usefelps/types';

export const create = (actor: ActorInstance): ContextApiMetaInstance => {
    return {
        ...Base.create({ key: 'context-api-meta', name: 'context-api-meta' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { actor });
            const meta = RequestMeta.create(context);

            return {
                getActorName: () => meta.data.reference.fActorKey,
                getActorInput: () => actor.input.data || {},
                getUserData: () => meta.userData || {},
                getMetaData: () => meta.data || {},
                getReference: () => meta.data.reference || {},
                getFlowName: () => meta.data.flowName,
                getStepName: () => meta.data.stepName,
                getFlowInput: () => {
                    return Trail.getFlow(trail, meta.data?.reference?.[FLOW_KEY_PROP])?.input || {};
                },
            } as ContextApiMetaAPI;
        },
    };
};

export default { create };
