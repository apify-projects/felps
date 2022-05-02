import requestMeta from './request-meta';
import base from './base';
import { ActorInstance, StepApiMetaInstance } from './types';
import { Trail } from '.';
import { FLOW_KEY_PROP } from './consts';

export const create = (actor: ActorInstance): StepApiMetaInstance => {
    return {
        ...base.create({ key: 'step-api-meta', name: 'step-api-meta' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { actor });
            const meta = requestMeta.create(context);

            return {
                getActorInput: () => actor.input.data,
                getUserData: () => meta.userData,
                getMetaData: () => meta.data,
                getRerence: () => meta.data.reference,
                getFlowInput: () => {
                    return Trail.getFlow(trail, meta.data?.reference?.[FLOW_KEY_PROP])?.input || {};
                },
            };
        },
    };
};

export default { create };
