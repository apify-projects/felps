import { ActorInstance, StepApiUtilsInstance } from './types';
import { resolveUrl } from './utils';
import base from './base';

export const create = (actor: ActorInstance): StepApiUtilsInstance => {
    return {
        ...base.create({ key: 'step-api-utils', name: 'step-api-utils' }),
        handler(RequestContext) {
            return {
                getActorInput() {
                    return actor.input;
                },
                absoluteUrl: (path: string) => resolveUrl(
                    path,
                    RequestContext?.request?.loadedUrl && RequestContext?.request?.loadedUrl !== 'about:blank'
                        ? RequestContext.request?.loadedUrl
                        : RequestContext.request?.url,
                ),
            };
        },
    };
};

export default { create };
