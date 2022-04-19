import { ApifyClient, ApifyClientOptions } from 'apify-client';
import { ApifyClientInstance } from './common/types';

export const create = (options?: ApifyClientOptions): ApifyClientInstance => {
    const { token = process.env.APIFY_TOKE, ...restOptions } = options || {};
    return {
        resource: new ApifyClient({ token, ...restOptions }),
    };
};

export default { create };
