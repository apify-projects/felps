import { BaseInstance, BaseOptions } from '@usefelps/types';
import { craftUIDKey } from '@usefelps/utils';

export const create = (options: BaseOptions): BaseInstance => {
    const {
        key,
        name = 'default',
        uid = craftUIDKey(key),
        id = `${uid}-${name}`,
    } = options;

    return {
        key,
        name,
        uid,
        id,
    };
};

export default { create };
