import { QueueOperationInfo, Request } from 'apify';
import { RequestQueue as ApifyRequestQueue } from 'apify/build/storages/request_queue';
import { ReallyAny, RequestOptionalOptions, RequestSource } from '@usefelps/types';
export default class RequestQueue extends ApifyRequestQueue {
    private _requestQueueStore;
    private _requestQueueHistoryStore;
    constructor(options: {
        id: string;
        name?: string | undefined;
        isLocal: boolean;
        client: ReallyAny;
    });
    addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo>;
    markRequestHandled(request: Request): Promise<QueueOperationInfo>;
    reclaimRequest(request: Request, options?: {
        forefront?: boolean;
    }): Promise<QueueOperationInfo>;
    fetchNextRequest(): Promise<Request | null>;
}
//# sourceMappingURL=index.d.ts.map