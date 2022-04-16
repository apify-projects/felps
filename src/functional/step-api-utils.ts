import { StepApiUtilsInstance } from '../common/types';
import { resolveUrl } from '../common/utils';
import base from './base';

export const create = (): StepApiUtilsInstance => {
    return {
        ...base.create({ key: 'step-api-utils', name: 'step-api-utils' }),
        handler(crawlingContext) {
            return {
                absoluteUrl: (path: string) => resolveUrl(
                    path,
                    crawlingContext?.request?.loadedUrl && crawlingContext?.request?.loadedUrl !== 'about:blank'
                        ? crawlingContext.request?.loadedUrl
                        : crawlingContext.request?.url,
                ),
            };
        },
    };
};

export default { create };
