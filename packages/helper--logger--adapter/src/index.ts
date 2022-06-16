import Base from '@usefelps/core--instance-base';
import * as FT from '@usefelps/types';

export const create = (options: FT.LoggerAdapterOptions): FT.LoggerAdapterInstance => {
    return {
        ...Base.create({ name: `logger--adapter--${options?.name}` }),
        adapter: options?.adapter,
    };
}

export default { create };
