import { CrawlingContext } from 'apify';
import { METADATA_KEY } from './common/consts';
import { RequestContext, RequestMetaData, RequestMetaInstance, RequestSource } from './common/types';
import base from './base';

export const create = (requestOrCrawlingContext: RequestSource | RequestContext | CrawlingContext): RequestMetaInstance => {
    const request = (requestOrCrawlingContext as RequestContext)?.request || (requestOrCrawlingContext as RequestSource);
    const userData = request?.userData;
    const data = userData?.[METADATA_KEY] || {};

    return {
        ...base.create({ key: 'request-meta', name: 'request-meta' }),
        request,
        userData,
        data,
    };
};

export const extend = (requestMeta: RequestMetaInstance, metadata: Partial<RequestMetaData>): RequestMetaInstance => {
    return create({
        ...requestMeta.request,
        userData: {
            ...requestMeta.userData,
            [METADATA_KEY]: {
                ...requestMeta.data,
                ...metadata,
            },
        },
    });
};

export default { create, extend };
