import { QueueOperationInfo } from 'apify';
import { QueueInstance, QueueOptions, RequestOptionalOptions, RequestSource } from '@usefelps/types';
export declare const create: (options?: QueueOptions) => QueueInstance;
export declare const load: (queue: QueueInstance, options?: {
    forceCloud?: boolean;
}) => Promise<QueueInstance>;
export declare const add: (queue: QueueInstance, request: RequestSource, options?: RequestOptionalOptions) => Promise<QueueOperationInfo>;
declare const _default: {
    create: (options?: QueueOptions) => QueueInstance;
    load: (queue: QueueInstance, options?: {
        forceCloud?: boolean;
    }) => Promise<QueueInstance>;
    add: (queue: QueueInstance, request: RequestSource, options?: {
        priority?: number;
        crawlerOptions?: import("@usefelps/types").RequestCrawlerOptions;
        forefront?: boolean;
    }) => Promise<QueueOperationInfo>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map