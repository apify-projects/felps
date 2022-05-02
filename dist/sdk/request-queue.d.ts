import { QueueOperationInfo, Request } from 'apify';
import { ApifyClient } from 'apify-client';
import { RequestQueue as ApifyRequestQueue } from 'apify/build/storages/request_queue';
import { RequestOptionalOptions, RequestSource } from '../types';
export default class RequestQueue extends ApifyRequestQueue {
    private _store;
    constructor(options: {
        id: string;
        name?: string | undefined;
        isLocal: boolean;
        client: ApifyClient;
    });
    addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo>;
    markRequestHandled(request: Request): Promise<QueueOperationInfo | null>;
    fetchNextRequest(): Promise<Request | null>;
}
//# sourceMappingURL=request-queue.d.ts.map