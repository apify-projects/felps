import { QueueCollectionInstance, QueueCollectionOptions } from '@usefelps/types';
import Queue from '@usefelps/core--request-queue';

export const DefaultQueueCollection = {
    default: Queue.create(),
};

export const create = <Names extends string[] = []>(options?: QueueCollectionOptions<Names>): QueueCollectionInstance<Names> => {
    const { names = [] } = options || {};

    return names.reduce((queues, name) => ({
        ...queues,
        [name]: Queue.create({ name }),
    }), DefaultQueueCollection as unknown as QueueCollectionInstance<Names>);
};

export default { create, DefaultQueueCollection };
