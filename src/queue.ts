import Apify from 'apify';
import { curry } from 'rambda';
import base from './base';
import { QueueInstance, QueueOptions, RequestOptionalOptions, RequestSource } from './common/types';
import { craftUIDKey } from './common/utils';
import logger from './logger';
import requestMeta from './request-meta';
import RequestQueue from './overrides/request-queue';

export const create = (options?: QueueOptions): QueueInstance => {
    const { name } = options || {};
    return {
        ...base.create({ key: 'queue', name, id: 'unknown' }),
        resource: undefined,
    };
};

export const load = async (queue: QueueInstance, options?: { forceCloud?: boolean; }): Promise<QueueInstance> => {
    if (queue.resource) return queue;

    const manager = new Apify.StorageManager(RequestQueue);
    const resource = await manager.openStorage(queue.name, options) as unknown as RequestQueue;

    return {
        ...queue,
        ...base.create({ key: 'queue', name: queue.name, id: resource.id }),
        resource,
    };
};

export const add = curry(async (queue: QueueInstance, request: RequestSource, options?: RequestOptionalOptions) => {
    const meta = requestMeta.create(request);
    const loaded = await load(queue);
    logger.info(logger.create(queue), `Queueing ${request.url} request for: ${meta.data.stepName}.`);
    return loaded.resource.addRequest({ uniqueKey: craftUIDKey('req', 6), ...request }, options);
});

export default { create, load, add };
