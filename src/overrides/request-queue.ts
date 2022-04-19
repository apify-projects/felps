import { QueueOperationInfo, Request } from 'apify';
import { RequestQueue as ApifyRequestQueue } from 'apify/build/storages/request_queue';
import { RequestMeta } from '..';
import { RequestOptionalOptions, RequestSource } from '../common/types';
export default class RequestQueue extends ApifyRequestQueue {
    private _stack: Map<string, number> = new Map();

    override async addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> {
        const { priority = Infinity, type = 'ajax', ...restOptions } = options || {};

        const meta = RequestMeta.extend(RequestMeta.create(request), { crawlerMode: type });

        const requestInfo = await super.addRequest(meta.request, restOptions);
        this._stack.set(requestInfo.requestId, priority);

        return requestInfo;
    }

    override async markRequestHandled(request) {
        this._stack.delete(request.id);
        return super.markRequestHandled(request);
    }

    override async fetchNextRequest(): Promise<Request> {
        const smallestPriority = Math.min(...Array.from(this._stack.values()));
        const [requestId] = Array.from(this._stack.entries())
            .find(([, priority]) => priority === smallestPriority) || [];

        if (requestId) {
            this._stack.delete(requestId);
            const request = await this.getRequest(requestId);
            if (request.handledAt) {
                this.recentlyHandled.add(requestId, true);
                return null;
            }
        }

        return super.fetchNextRequest();
    }
}
