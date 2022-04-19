import { QueueOperationInfo, Request, RequestQueue as ApifyRequestQueue } from 'apify';
import { RequestOptionalOptions, RequestSource } from '../common/types';

export default class RequestQueue extends ApifyRequestQueue {
    private _stack: Map<string, number>;

    async addRequestWithPriority(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> {
        const { priority = Infinity, ...restOptions } = options || {};

        const requestInfo = await this.addRequest(request, restOptions);
        this._stack.set(requestInfo.requestId, priority);

        return requestInfo;
    }

    override fetchNextRequest(): Promise<Request> {
        const smallestPriority = Math.min(...Array.from(this._stack.values()));
        const [requestId] = Array
            .from(this._stack.entries())
            .find(([, priority]) => priority === smallestPriority);

        return this.getRequest(requestId);
    }
}
