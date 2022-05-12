import { Trail } from '.';
import base from './base';
import { FLOW_KEY_PROP } from './consts';
import requestMeta from './request-meta';
import { ActorInstance, ReallyAny, StepApiMetaInstance } from './types';

export const create = (actor: ActorInstance): StepApiMetaInstance => {
    return {
        ...base.create({ key: 'step-api-meta', name: 'step-api-meta' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { actor });
            const meta = requestMeta.create(context);

            return {
                getActorName: () => meta.data.reference.fActorKey,
                getActorInput: () => actor.input.data,
                getUserData: () => meta.userData,
                getMetaData: () => meta.data,
                getReference: () => meta.data.reference,
                getFlowName: () => meta.data.flowName,
                getStepName: () => meta.data.stepName,
                getFlowInput: () => {
                    return Trail.getFlow(trail, meta.data?.reference?.[FLOW_KEY_PROP])?.input || {};
                },
            } as ReallyAny;
        },
    };
};

export default { create };
