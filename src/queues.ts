import { QueuesInstance, QueuesOptions } from './common/types';
import queue from './queue';

export const DefaultQueues = {
    default: queue.create(),
};

export const create = <Names extends string[] = []>(options?: QueuesOptions<Names>): QueuesInstance<Names> => {
    const { names = [] } = options || {};

    return names.reduce((queues, name) => ({
        ...queues,
        [name]: queue.create({ name }),
    }), DefaultQueues as unknown as QueuesInstance<Names>);
};

export default { create, DefaultQueues };
