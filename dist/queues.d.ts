import { QueuesInstance, QueuesOptions } from './types';
export declare const DefaultQueues: {
    default: import("./types").QueueInstance;
};
export declare const create: <Names extends string[] = []>(options?: QueuesOptions<Names> | undefined) => QueuesInstance<Names>;
declare const _default: {
    create: <Names extends string[] = []>(options?: QueuesOptions<Names> | undefined) => QueuesInstance<Names>;
    DefaultQueues: {
        default: import("./types").QueueInstance;
    };
};
export default _default;
//# sourceMappingURL=queues.d.ts.map