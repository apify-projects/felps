import { QueueOperationInfo, Request } from 'apify';
import { ApifyClient } from 'apify-client';
import { RequestQueue as ApifyRequestQueue } from 'apify/build/storages/request_queue';
import { DataStore, RequestMeta } from '..';
import { DataStoreInstance, RequestOptionalOptions, RequestSource } from '../common/types';

export default class RequestQueue extends ApifyRequestQueue {
    private _store: DataStoreInstance;

    constructor(options?: {
        id: string;
        name?: string | undefined;
        isLocal: boolean;
        client: ApifyClient; // | ApifyStorageLocal
    }) {
        super(options);
        this._store = DataStore.create({ name: 'request-queue', key: 'request-queue' });
        DataStore.listen(this._store);
    }

    override async addRequest(request: RequestSource, options?: RequestOptionalOptions): Promise<QueueOperationInfo> {
        const { priority = Infinity, type = 'ajax', ...restOptions } = options || {};
        const store = await DataStore.load(this._store);

        const meta = RequestMeta.extend(RequestMeta.create(request), { crawlerMode: type });

        const requestInfo = await super.addRequest(meta.request, restOptions);
        DataStore.set(store, requestInfo.requestId, priority);

        return requestInfo;
    }

    override async markRequestHandled(request: Request) {
        const store = await DataStore.load(this._store);
        DataStore.remove(store, request.id);
        return super.markRequestHandled(request);
    }

    override async fetchNextRequest(): Promise<Request> {
        const store = await DataStore.load(this._store);
        const smallestPriority = Math.min(...DataStore.values(store));
        const [requestId] = DataStore.entries(store).find(([, priority]) => priority === smallestPriority) || [];

        if (requestId) {
            DataStore.remove(store, requestId);
            const request = await this.getRequest(requestId);
            if (request.handledAt) {
                this.recentlyHandled.add(requestId, true);
                return null;
            }
        }

        return super.fetchNextRequest();
    }
}
