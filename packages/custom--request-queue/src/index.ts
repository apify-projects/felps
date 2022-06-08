import { QueueOperationInfo, Request } from 'apify';
import { RequestQueue as ApifyRequestQueue } from 'apify/build/storages/request_queue';
import DataStore from '@usefelps/core--store--data';
import RequestMeta from '@usefelps/core--request-meta';
import ApifyKvStore from '@usefelps/adapter--kv-store--apify';
import { DataStoreInstance, ReallyAny, RequestOptionalOptions, RequestSource } from '@usefelps/types';

export default class RequestQueue extends ApifyRequestQueue {
    private _requestQueueStore: DataStoreInstance;
    private _requestQueueHistoryStore: DataStoreInstance;

    constructor(options: {
        id: string;
        name?: string | undefined;
        isLocal: boolean;
        client: ReallyAny; // | ApifyStorageLocal
    }) {
        super(options);
        this._requestQueueStore = DataStore.create({ name: `rq-${options?.name || 'default'}`, key: 'request-queue', adapter: ApifyKvStore() });
        this._requestQueueHistoryStore = DataStore.create({
            name: `rqh-${options?.name || 'default'}`,
            key: 'request-queue-history',
            adapter: ApifyKvStore(),
        });
        DataStore.listen(this._requestQueueStore);
        DataStore.listen(this._requestQueueHistoryStore);
    }

    override async addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> {
        const { priority = Infinity, crawlerOptions, ...restOptions } = options || {};
        const reqQueueStore = await DataStore.load(this._requestQueueStore);

        const meta = RequestMeta.extend(RequestMeta.create(request), { crawlerOptions });

        const requestInfo = await super.addRequest(meta.request, restOptions);
        DataStore.set(reqQueueStore, requestInfo.requestId, priority);

        return requestInfo;
    }

    override async markRequestHandled(request: Request) {
        const reqQueueHistoryStore = await DataStore.load(this._requestQueueStore);
        DataStore.remove(reqQueueHistoryStore, request.id);
        return super.markRequestHandled(request);
    }

    override async reclaimRequest(request: Request, options: { forefront?: boolean } = {}) {
        const reqQueueHistoryStore = await DataStore.load(this._requestQueueStore);

        const localRequest = DataStore.get(reqQueueHistoryStore, request.id);
        if (localRequest) {
            localRequest.retryCount++;
        }

        const queueOperationInfo = super.reclaimRequest(localRequest || request, options);

        return queueOperationInfo;
    }

    override async fetchNextRequest(): Promise<Request | null> {
        const reqQueueStore = await DataStore.load(this._requestQueueStore);
        const reqQueueHistoryStore = await DataStore.load(this._requestQueueHistoryStore);

        const smallestPriority = Math.min(...DataStore.values(reqQueueStore));
        const [requestId] = DataStore.entries(reqQueueStore).find(([, priority]) => priority === smallestPriority) || [];

        if (requestId) {
            DataStore.set(reqQueueHistoryStore, requestId, DataStore.get(reqQueueStore, requestId));
            DataStore.remove(reqQueueStore, requestId);
            const request = await this.getRequest(requestId);
            if (request?.handledAt) {
                this.recentlyHandled.add(requestId, true);
                return null;
            }
        }

        return super.fetchNextRequest();
    }
}
