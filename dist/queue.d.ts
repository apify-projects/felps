import { QueueOperationInfo } from 'apify';
import { QueueInstance, QueueOptions, RequestOptionalOptions, RequestSource } from './types';
export declare const create: (options?: QueueOptions | undefined) => QueueInstance;
export declare const load: (queue: QueueInstance, options?: {
    forceCloud?: boolean | undefined;
} | undefined) => Promise<QueueInstance>;
export declare const add: (queue: QueueInstance, request: RequestSource, options?: RequestOptionalOptions) => Promise<QueueOperationInfo>;
declare const _default: {
    create: (options?: QueueOptions | undefined) => QueueInstance;
    load: (queue: QueueInstance, options?: {
        forceCloud?: boolean | undefined;
    } | undefined) => Promise<QueueInstance>;
    add: (queue: QueueInstance, request: RequestSource, options?: RequestOptionalOptions) => Promise<QueueOperationInfo>;
};
export default _default;
//# sourceMappingURL=queue.d.ts.map