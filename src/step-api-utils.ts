import base from './base';
import { StepApiUtilsInstance } from './types';
import { resolveUrl } from './utils';

export const create = (): StepApiUtilsInstance => {
    return {
        ...base.create({ key: 'step-api-utils', name: 'step-api-utils' }),
        handler(context) {
            return {
                absoluteUrl: (path: string) => resolveUrl(
                    path,
                    context?.request?.loadedUrl && context?.request?.loadedUrl !== 'about:blank'
                        ? context.request?.loadedUrl
                        : context.request?.url,
                ),
            };
        },
    };
};

export default { create };
