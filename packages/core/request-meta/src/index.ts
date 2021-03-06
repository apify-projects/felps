import InstanceBase from '@usefelps/instance-base';
import * as CONST from '@usefelps/constants';
import * as FT from '@usefelps/types';
import * as utils from '@usefelps/utils';

export const create = (requestOrRequestContext?: FT.RequestSource | FT.RequestContext | FT.RequestContext): FT.RequestMetaInstance => {
    const request = utils.clone((requestOrRequestContext as FT.RequestContext)?.request || (requestOrRequestContext as FT.RequestSource) || { userData: {} });
    const userData = {
        ...(request?.userData || {}),
        [CONST.METADATA_KEY]: utils.merge(
            {
                startFlow: false,
                stopFlow: false,
                stopStep: false,

                actorName: undefined,
                flowName: undefined,
                stepName: undefined,

                trailId: undefined,
                flowId: undefined,
                requestId: undefined,

                crawlerMode: 'http',
            },
            request?.userData?.[CONST.METADATA_KEY] || {},
        ),
    };

    request.userData = userData;
    const data = Reflect.get(request.userData, CONST.METADATA_KEY);

    return {
        ...InstanceBase.create({ key: 'request-meta', name: 'request-meta' }),
        request: request as FT.RequestSource,
        userData,
        data,
    };
};

export const contextDefaulted = (context?: FT.RequestContext): FT.RequestContext => {
    return (context || {
        request: {
            userData: {
                ...(context?.request?.userData || {}),
                [CONST.METADATA_KEY]: {
                    [CONST.TRAIL_ID_PROP]: utils.craftUIDKey('trail'),
                },
            },
        },
    }) as unknown as FT.RequestContext;
};

export const extend = (RequestMeta: FT.RequestMetaInstance, ...metadata: Partial<FT.RequestMetaData>[]): FT.RequestMetaInstance => {
    return create({
        ...RequestMeta.request,
        userData: {
            ...(RequestMeta.userData || {}),
            [CONST.METADATA_KEY]: (metadata || []).reduce((acc, data) => utils.merge(acc, data), RequestMeta.data),
        },
    });
};

export const cloneContext = (context: FT.RequestContext): FT.RequestContext => {
    return {
        ...context,
        request: utils.clone(context.request),
    };
};

export default { create, extend, contextDefaulted, cloneContext };
