import * as FT from '@usefelps/types';
import Queue from '@usefelps/request-queue';

export const DefaultQueueCollection = {
    default: Queue.create(),
};

export const create = (options?: FT.QueueCollectionOptions): FT.QueueCollectionInstance => {
    const { names = [] } = options || {};

    return names.reduce((queues, name) => ({
        ...queues,
        [name]: Queue.create({ name }),
    }), DefaultQueueCollection as unknown as FT.QueueCollectionInstance);
};

export const load = async (queues: FT.QueueCollectionOptions): Promise<FT.QueueCollectionInstance> => {
    const queuesLoaded = await Promise.all(
        Object.values(queues as Record<string, FT.RequestRequestQueueInstance>).map(async (queue) => Queue.load(queue)),
    ) as FT.RequestRequestQueueInstance[];

    return queuesLoaded.reduce((acc, queue: FT.RequestRequestQueueInstance) => {
        acc[queue.name] = queue;
        return acc;
    }, {} as FT.QueueCollectionInstance);
};

export default { create, load, DefaultQueueCollection };
