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
        // State.listen(this._requestQueueStore);
        // State.listen(this._requestQueueHistoryStore);
    }

    async enforceLoadedStores() {
        this._requestQueueStore = await State.load(this._requestQueueStore);
        this._requestQueueHistoryStore = await State.load(this._requestQueueHistoryStore)
    }

    override async addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> {
        const { priority = Infinity, crawlerMode, ...restOptions } = options || {};
        await this.enforceLoadedStores()

        const meta = RequestMeta.extend(RequestMeta.create(request), { crawlerMode });

        const requestInfo = await super.addRequest(meta.request, restOptions);
        State.set(this._requestQueueStore, requestInfo.requestId, priority);

        return requestInfo;
    }

    override async markRequestHandled(request: Request) {
        await this.enforceLoadedStores()
        State.remove(this._requestQueueStore, request.id);
        return super.markRequestHandled(request);
    }

    override async reclaimRequest(request: Request, options: { forefront?: boolean } = {}) {
        await this.enforceLoadedStores()

        const localRequest = State.get(this._requestQueueStore, request.id);
        if (localRequest) {
            localRequest.retryCount++;
        }

        const queueOperationInfo = super.reclaimRequest(localRequest || request, options);

        return queueOperationInfo;
    }

    override async fetchNextRequest(): Promise<Request | null> {
        await this.enforceLoadedStores()

        const smallestPriority = Math.min(...State.values(this._requestQueueStore));
        const [requestId] = State.entries(this._requestQueueStore).find(([, priority]) => priority === smallestPriority) || [];

        if (requestId) {
            State.set(this._requestQueueHistoryStore, requestId, State.get(this._requestQueueStore, requestId));
            State.remove(this._requestQueueStore, requestId);
            const request = await this.getRequest(requestId);
            if (request?.handledAt) {
                this.recentlyHandled.add(requestId, true);
                return null;
            }
        }

        return super.fetchNextRequest();
    }
}
