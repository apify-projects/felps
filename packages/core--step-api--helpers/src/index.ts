import base from '@usefelps/core--instance-base';
import { StepApiHelpersInstance } from '@usefelps/types';
import { resolveUrl } from '@usefelps/helper--utils';

export const create = (): StepApiHelpersInstance => {
    return {
        ...base.create({ key: 'step-api-helpers', name: 'step-api-helpers' }),
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
