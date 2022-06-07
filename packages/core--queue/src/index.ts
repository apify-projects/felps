import { QueueOperationInfo } from 'apify';
import { StorageManager } from 'apify/build/storages/storage_manager';
import Base from '@usefelps/core--instance-base';
import Logger from '@usefelps/helper--logger';
import RequestQueue from '@usefelps/custom--request-queue';
import RequestMeta from '@usefelps/core--request-meta';
import { QueueInstance, QueueOptions, RequestOptionalOptions, RequestSource } from '@usefelps/types';
import { craftUIDKey, getUIDKeyTime } from '@usefelps/helper--utils';

export const create = (options?: QueueOptions): QueueInstance => {
    const { name } = options || {};
    return {
        ...Base.create({ key: 'queue', name: name as string }),
        resource: undefined,
    };
};

export const load = async (queue: QueueInstance, options?: { forceCloud?: boolean; }): Promise<QueueInstance> => {
    if (queue.resource) return queue;

    const manager = new StorageManager(RequestQueue);
    const resource = await manager.openStorage(queue.name, options) as unknown as RequestQueue;

    return {
        ...queue,
        ...Base.create({ key: 'queue', name: queue.name, id: resource.id }),
        resource,
    };
};

export const add = async (queue: QueueInstance, request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> => {
    const meta = RequestMeta.create(request);
    const loaded = await load(queue);
    if (!loaded?.resource) throw new Error('Queue not loaded');
    Logger.info(Logger.create(queue), `Queueing ${request.url} request for: ${meta.data.stepName}.`);
    const priority = meta.data.reference.fTrailKey ? getUIDKeyTime(meta.data.reference.fTrailKey) : undefined;
    return loaded.resource.addRequest({ uniqueKey: craftUIDKey('req', 6), ...request }, { priority, ...options });
};

export default { create, load, add };
