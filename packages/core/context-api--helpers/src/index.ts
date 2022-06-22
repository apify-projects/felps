import base from '@usefelps/instance-base';
import { ContextApiHelpersInstance } from '@usefelps/types';
import { resolveUrl } from '@usefelps/utils';

export const create = (): ContextApiHelpersInstance => {
    return {
        ...base.create({ key: 'context-api-helpers', name: 'context-api-helpers' }),
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
