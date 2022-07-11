import { QueueOperationInfo, StorageManager } from '@crawlee/core';
import Base from '@usefelps/instance-base';
import Logger from '@usefelps/logger';
import RequestQueue from '@usefelps/crawlee--request-queue';
import RequestMeta from '@usefelps/request-meta';
import { RequestQueueInstance, RequestQueueOptions, RequestOptionalOptions, RequestSource } from '@usefelps/types';
import { craftUIDKey, getUIDKeyTime } from '@usefelps/utils';

export const create = (options?: RequestQueueOptions): RequestQueueInstance => {
    const { name } = options || {};
    return {
        ...Base.create({ key: 'queue', name }),
        resource: undefined,
    };
};

export const load = async (queue: RequestQueueInstance): Promise<RequestQueueInstance> => {
    if (queue.resource) return queue;

    const manager = new StorageManager(RequestQueue);
    const resource = await manager.openStorage(queue.name) as unknown as RequestQueue;

    return {
        ...queue,
        ...Base.create({ key: 'queue', name: queue.name, id: resource.id }),
        resource,
    };
};

export const add = async (queue: RequestQueueInstance, request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> => {
    const meta = RequestMeta.create(request);
    const loaded = await load(queue);
    if (!loaded?.resource) throw new Error('Queue not loaded');
    Logger.info(Logger.create(queue), `Queueing ${request.url} request for: ${meta.data.stepName}.`);
    const priority = meta.data.trailKey ? getUIDKeyTime(meta.data.trailKey) : undefined;
    return loaded.resource.addRequest({ uniqueKey: craftUIDKey('req', 6), ...request }, { priority, ...options });
};

export default { create, load, add };
