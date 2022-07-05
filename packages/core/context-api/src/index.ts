import ContextApiMeta from '@usefelps/context-api--meta';
import ContextApiHelpers from '@usefelps/context-api--helpers';
import * as FT from '@usefelps/types';

// actor: FT.ActorInstance
export const create = () => (context: FT.RequestContext) => {
    return {
        // ...ContextApiFlow.create(actor).handler(context),
        ...ContextApiMeta.create().handler(context),
        // ...ContextApiModel.create(actor).handler(context),
        ...ContextApiHelpers.create().handler(context),
    };
};

export default { create };
