import { ApifyClient, ApifyClientOptions } from 'apify-client';
import { ApifyClientInstance } from '@usefelps/types';

export const create = (options?: ApifyClientOptions): ApifyClientInstance => {
    const { token = process.env.APIFY_TOKEN, ...restOptions } = options || {};
    return {
        resource: new ApifyClient({ token, ...restOptions }),
    };
};

export default { create };
