import ContextApiMeta from '@usefelps/context-api--meta';
import ContextApiHelpers from '@usefelps/context-api--helpers';
import ContextApiFlow from '@usefelps/context-api--flow';
import * as FT from '@usefelps/types';

export const create = (actor: FT.ActorInstance) => (context: FT.RequestContext) => {
    return {
        ...ContextApiFlow.create(actor).handler(context),
        ...ContextApiMeta.create(actor).handler(context),
        ...ContextApiHelpers.create().handler(context),
    };
};

export default { create };
