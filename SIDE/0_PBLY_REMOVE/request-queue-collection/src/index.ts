import * as FT from '@usefelps/types';
import RequestQueue from '@usefelps/request-queue';

export const DefaultQueueCollection = {
    default: RequestQueue.create(),
};

export const create = (options?: FT.QueueCollectionOptions): FT.QueueCollectionInstance => {
    const { names = [] } = options || {};

    return names.reduce((queues, name) => ({
        ...queues,
        [name]: RequestQueue.create({ name }),
    }), DefaultQueueCollection as unknown as FT.QueueCollectionInstance);
};

export const load = async (queues: FT.QueueCollectionOptions): Promise<FT.QueueCollectionInstance> => {
    const queuesLoaded = await Promise.all(
        Object.values(queues as Record<string, FT.RequestRequestQueueInstance>).map(async (queue) => RequestQueue.load(queue)),
    ) as FT.RequestRequestQueueInstance[];

    return queuesLoaded.reduce((acc, queue: FT.RequestRequestQueueInstance) => {
        acc[queue.name] = queue;
        return acc;
    }, {} as FT.QueueCollectionInstance);
};

export default { create, load, DefaultQueueCollection };
