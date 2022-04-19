import { QueueOperationInfo, Request } from 'apify';
import { RequestQueue as ApifyRequestQueue } from 'apify/build/storages/request_queue';
import { RequestOptionalOptions, RequestSource } from '../common/types';

export default class RequestQueue extends ApifyRequestQueue {
    private _stack: Map<string, number>;

    override async addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> {
        const { priority = Infinity, ...restOptions } = options || {};

        const requestInfo = await super.addRequest(request, restOptions);
        this._stack.set(requestInfo.requestId, priority);

        return requestInfo;
    }

    override async markRequestHandled(request) {
        this._stack.delete(request.id);
        return super.markRequestHandled(request);
    }

    override async fetchNextRequest(): Promise<Request> {
        const smallestPriority = Math.min(...Array.from(this._stack.values()));
        const [requestId] = Array
            .from(this._stack.entries())
            .find(([, priority]) => priority === smallestPriority);

        return this.getRequest(requestId) || super.fetchNextRequest();
    }
}
