import { FLOW_KEY_PROP } from '@usefelps/constants';
import Base from '@usefelps/core--instance-base';
import RequestMeta from '@usefelps/core--request-meta';
import Trail from '@usefelps/core--trail';
import { ActorInstance, StepApiMetaAPI, StepApiMetaInstance } from '@usefelps/types';

export const create = (actor: ActorInstance): StepApiMetaInstance => {
    return {
        ...Base.create({ key: 'step-api-meta', name: 'step-api-meta' }),
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
            } as StepApiMetaAPI;
        },
    };
};

export default { create };
