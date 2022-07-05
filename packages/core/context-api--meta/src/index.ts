import Base from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import * as FT from '@usefelps/types';

// actor: ActorInstance
export const create = (): FT.ContextApiMetaInstance => {
    return {
        ...Base.create({ key: 'context-api-meta', name: 'context-api-meta' }),
        handler(context) {
            const meta = RequestMeta.create(context);

            return {
                getActorName: () => meta.data.context.actorKey,
                getActorInput: () => { }, // actor.input.data ||
                getUserData: () => meta.userData || {},
                getMetaData: () => meta.data || {},
                getFlowName: () => meta.data.context.flowName,
                getStepName: () => meta.data.context.stepName,
                getFlowInput: () => {
                },
            } as FT.ContextApiMetaAPI;
        },
    };
};

export default { create };
