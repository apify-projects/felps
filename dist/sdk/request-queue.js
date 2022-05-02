"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_queue_1 = require("apify/build/storages/request_queue");
const __1 = require("..");
class RequestQueue extends request_queue_1.RequestQueue {
    _store;
    constructor(options) {
        super(options);
        this._store = __1.DataStore.create({ name: options?.name || 'default', key: 'request-queue' });
        __1.DataStore.listen(this._store);
    }
    async addRequest(request, options) {
        const { priority = Infinity, type = 'http', ...restOptions } = options || {};
        const store = await __1.DataStore.load(this._store);
        const meta = __1.RequestMeta.extend(__1.RequestMeta.create(request), { crawlerMode: type });
        const requestInfo = await super.addRequest(meta.request, restOptions);
        __1.DataStore.set(store, requestInfo.requestId, priority);
        return requestInfo;
    }
    async markRequestHandled(request) {
        const store = await __1.DataStore.load(this._store);
        __1.DataStore.remove(store, request.id);
        return super.markRequestHandled(request);
    }
    async fetchNextRequest() {
        const store = await __1.DataStore.load(this._store);
        const smallestPriority = Math.min(...__1.DataStore.values(store));
        const [requestId] = __1.DataStore.entries(store).find(([, priority]) => priority === smallestPriority) || [];
        if (requestId) {
            __1.DataStore.remove(store, requestId);
            const request = await this.getRequest(requestId);
            if (request?.handledAt) {
                this.recentlyHandled.add(requestId, true);
                return null;
            }
        }
        return super.fetchNextRequest();
    }
}
exports.default = RequestQueue;
//# sourceMappingURL=request-queue.js.map