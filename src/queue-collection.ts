import { QueueCollectionInstance, QueueCollectionOptions } from './types';
import queue from './queue';

export const DefaultQueueCollection = {
    default: queue.create(),
};

export const create = <Names extends string[] = []>(options?: QueueCollectionOptions<Names>): QueueCollectionInstance<Names> => {
    const { names = [] } = options || {};

    return names.reduce((queues, name) => ({
        ...queues,
        [name]: queue.create({ name }),
    }), DefaultQueueCollection as unknown as QueueCollectionInstance<Names>);
};

export default { create, DefaultQueueCollection };
