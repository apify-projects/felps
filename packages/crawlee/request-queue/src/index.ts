import { QueueOperationInfo, Request, RequestQueue as ApifyRequestQueue } from '@crawlee/core';
import State from '@usefelps/state';
import RequestMeta from '@usefelps/request-meta';
import ApifyKvStore from '@usefelps/kv-store--adapter--apify';
import { StateInstance, ReallyAny, RequestOptionalOptions, RequestSource } from '@usefelps/types';

export default class RequestQueue extends ApifyRequestQueue {
    private _requestQueueStore: StateInstance;
    private _requestQueueHistoryStore: StateInstance;

    constructor(options: {
        id: string;
        name?: string | undefined;
        isLocal: boolean;
        client: ReallyAny; // | ApifyStorageLocal
    }) {
        super(options);
        this._requestQueueStore = State.create({ name: `rq-${options?.name || 'default'}`, key: 'request-queue', adapter: ApifyKvStore() });
        this._requestQueueHistoryStore = State.create({
            name: `rqh-${options?.name || 'default'}`,
            key: 'request-queue-history',
            adapter: ApifyKvStore(),
        });
        State.listen(this._requestQueueStore);
        State.listen(this._requestQueueHistoryStore);
    }

    override async addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> {
        const { priority = Infinity, crawlerOptions, ...restOptions } = options || {};
        const reqQueueStore = await State.load(this._requestQueueStore);

        const meta = RequestMeta.extend(RequestMeta.create(request), { crawlerOptions });

        const requestInfo = await super.addRequest(meta.request, restOptions);
        State.set(reqQueueStore, requestInfo.requestId, priority);

        return requestInfo;
    }

    override async markRequestHandled(request: Request) {
        const reqQueueHistoryStore = await State.load(this._requestQueueStore);
        State.remove(reqQueueHistoryStore, request.id);
        return super.markRequestHandled(request);
    }

    override async reclaimRequest(request: Request, options: { forefront?: boolean } = {}) {
        const reqQueueHistoryStore = await State.load(this._requestQueueStore);

        const localRequest = State.get(reqQueueHistoryStore, request.id);
        if (localRequest) {
            localRequest.retryCount++;
        }

        const queueOperationInfo = super.reclaimRequest(localRequest || request, options);

        return queueOperationInfo;
    }

    override async fetchNextRequest(): Promise<Request | null> {
        const reqQueueStore = await State.load(this._requestQueueStore);
        const reqQueueHistoryStore = await State.load(this._requestQueueHistoryStore);

        const smallestPriority = Math.min(...State.values(reqQueueStore));
        const [requestId] = State.entries(reqQueueStore).find(([, priority]) => priority === smallestPriority) || [];

        if (requestId) {
            State.set(reqQueueHistoryStore, requestId, State.get(reqQueueStore, requestId));
            State.remove(reqQueueStore, requestId);
            const request = await this.getRequest(requestId);
            if (request?.handledAt) {
                this.recentlyHandled.add(requestId, true);
                return null;
            }
        }

        return super.fetchNextRequest();
    }
}
