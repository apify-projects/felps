import Apify from 'apify';
import { curry } from 'rambda';
import { QueueInstance, QueueOptions, RequestOptionalOptions, RequestSource } from './common/types';
import { craftUIDKey } from './common/utils';
import base from './base';
import logger from './logger';
import requestMeta from './request-meta';

export const create = (options?: QueueOptions): QueueInstance => {
    const { name } = options || {};
    return {
        ...base.create({ key: 'queue', name }),
        resource: undefined,
    };
};

export const load = async (queue: QueueInstance): Promise<QueueInstance> => {
    if (queue.resource) return queue;

    return {
        ...queue,
        resource: await Apify.openRequestQueue(queue.name),
    };
};

export const add = curry(async (queue: QueueInstance, request: RequestSource, options?: RequestOptionalOptions) => {
    const meta = requestMeta.create(request);
    const loaded = await load(queue);
    logger.info(logger.create(queue), `Queueing ${request.url} request for: ${meta.data.step}.`);
    return loaded.resource.addRequest({ uniqueKey: craftUIDKey('req', 6), ...request, ...options });
});

export default { create, load, add };
