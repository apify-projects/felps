import cloneDeep from 'lodash.clonedeep';
import { mergeDeepRight } from 'ramda';
import base from './base';
import { METADATA_KEY, TRAIL_KEY_PROP } from './consts';
import { RequestContext, RequestMetaData, RequestMetaInstance, RequestSource } from './types';
import { craftUIDKey } from './utils';

export const create = (requestOrRequestContext?: RequestSource | RequestContext | RequestContext): RequestMetaInstance => {
    const request = cloneDeep((requestOrRequestContext as RequestContext)?.request || (requestOrRequestContext as RequestSource));
    const userData = {
        ...(request?.userData || {}),
        [METADATA_KEY]: mergeDeepRight(
            {
                flowStart: false,
                flowName: undefined,
                stepName: undefined,
                crawlerMode: undefined,
                reference: {},
            },
            request?.userData?.[METADATA_KEY] || {},
        ),
    };

    request.userData = userData;
    const data = request.userData[METADATA_KEY];

    return {
        ...base.create({ key: 'request-meta', name: 'request-meta' }),
        request,
        userData,
        data,
    };
};

export const contextDefaulted = (context?: RequestContext): RequestContext => {
    return (context || {
        request: {
            userData: {
                [METADATA_KEY]: {
                    reference: {
                        [TRAIL_KEY_PROP]: craftUIDKey('trail'),
                    },
                },
            },
        },
    }) as unknown as RequestContext;
};

export const extend = (requestMeta: RequestMetaInstance, ...metadata: Partial<RequestMetaData>[]): RequestMetaInstance => {
    return create({
        ...requestMeta.request,
        userData: {
            ...(requestMeta.userData || {}),
            [METADATA_KEY]: (metadata || []).reduce((acc, data) => mergeDeepRight(acc, data), requestMeta.data),
        },
    });
};

export const cloneContext = (context: RequestContext): RequestContext => {
    return {
        ...context,
        request: cloneDeep(context.request),
    };
};

export default { create, extend, contextDefaulted, cloneContext };
