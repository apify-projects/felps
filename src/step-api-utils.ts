import { Trail } from '.';
import base from './base';
import { ActorInstance, StepApiUtilsInstance } from './types';
import { resolveUrl } from './utils';

export const create = (actor: ActorInstance): StepApiUtilsInstance => {
    return {
        ...base.create({ key: 'step-api-utils', name: 'step-api-utils' }),
        handler(context) {
            const trail = Trail.createFrom(context?.request, { actor });

            return {
                getFlowInput() {
                    return Trail.get(trail).input;
                },
                getActorInput() {
                    return actor.input.data;
                },
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
