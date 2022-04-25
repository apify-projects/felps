import mergeWith from 'lodash.mergewith';
import { CrawlingContext } from 'apify';
import { METADATA_KEY } from './consts';
import { RequestContext, RequestMetaData, RequestMetaInstance, RequestSource } from './types';
import base from './base';
import { craftUIDKey } from './utils';

export const create = (requestOrCrawlingContext?: RequestSource | RequestContext | CrawlingContext): RequestMetaInstance => {
    const request = (requestOrCrawlingContext as RequestContext)?.request || (requestOrCrawlingContext as RequestSource);
    const userData = request?.userData || {};
    const data = {
        stepName: undefined,
        crawlerMode: undefined,
        reference: {},
        ...(userData?.[METADATA_KEY] || {}),
    } as RequestMetaData;

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
                        trailKey: craftUIDKey('trail'),
                    },
                },
            },
        },
    }) as unknown as RequestContext;
};

export const extend = (requestMeta: RequestMetaInstance, metadata: Partial<RequestMetaData>): RequestMetaInstance => {
    return create({
        ...requestMeta.request,
        userData: {
            ...requestMeta.userData,
            [METADATA_KEY]: mergeWith(requestMeta.data, metadata),
        },
    });
};

export default { create, extend, contextDefaulted };
