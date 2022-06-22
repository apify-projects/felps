import ContextApiFlow from '@usefelps/context-api--flow';
import ContextApiMeta from '@usefelps/context-api--meta';
import ContextApiModel from '@usefelps/context-api--model';
import ContextApiHelpers from '@usefelps/context-api--helpers';
import * as FT from '@usefelps/types';

export const create = (actor: FT.ActorInstance) => (context: FT.RequestContext) => {
    return {
        ...ContextApiFlow.create(actor).handler(context),
        ...ContextApiMeta.create(actor).handler(context),
        ...ContextApiModel.create(actor).handler(context),
        ...ContextApiHelpers.create().handler(context),
    };
};

export default { create };
