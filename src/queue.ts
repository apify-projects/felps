import { QueueOperationInfo } from 'apify';
import { StorageManager } from 'apify/build/storages/storage_manager';
import base from './base';
import { QueueInstance, QueueOptions, RequestOptionalOptions, RequestSource } from './types';
import { craftUIDKey, getUIDKeyTime } from './utils';
import Logger from './logger';
import RequestQueue from './sdk/request-queue';
import requestMeta from './request-meta';

export const create = (options?: QueueOptions): QueueInstance => {
    const { name } = options || {};
    return {
        ...base.create({ key: 'queue', name: name as string }),
        resource: undefined,
    };
};

export const load = async (queue: QueueInstance, options?: { forceCloud?: boolean; }): Promise<QueueInstance> => {
    if (queue.resource) return queue;

    const manager = new StorageManager(RequestQueue);
    const resource = await manager.openStorage(queue.name, options) as unknown as RequestQueue;

    return {
        ...queue,
        ...base.create({ key: 'queue', name: queue.name, id: resource.id }),
        resource,
    };
};

export const add = async (queue: QueueInstance, request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> => {
    const meta = requestMeta.create(request);
    const loaded = await load(queue);
    if (!loaded?.resource) throw new Error('Queue not loaded');
    Logger.info(Logger.create(queue), `Queueing ${request.url} request for: ${meta.data.stepName}.`);
    const priority = meta.data.reference.fTrailKey ? getUIDKeyTime(meta.data.reference.fTrailKey) : undefined;
    return loaded.resource.addRequest({ uniqueKey: craftUIDKey('req', 6), ...request }, { priority, ...options });
};

export default { create, load, add };
