import Base from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import * as FT from '@usefelps/types';

export const create = (actor: FT.ActorInstance): FT.ContextApiMetaInstance => {
    return {
        ...Base.create({ key: 'context-api-meta', name: 'context-api-meta' }),
        handler(context) {
            const meta = RequestMeta.create(context);

            return {
                getActorName: () => meta.data.actorName,
                getActorInput: () => actor.input,
                getUserData: () => meta.userData || {},
                getMetaData: () => meta.data || {},
                getFlowName: () => meta.data.flowName,
                getStepName: () => meta.data.stepName,
                getFlowInput: () => {
                },
            } as FT.ContextApiMetaAPI;
        },
    };
};

export default { create };
