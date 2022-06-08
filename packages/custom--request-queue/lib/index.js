"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_queue_1 = require("apify/build/storages/request_queue");
const core__store__data_1 = tslib_1.__importDefault(require("@usefelps/core--store--data"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const adapter__kv_store__apify_1 = tslib_1.__importDefault(require("@usefelps/adapter--kv-store--apify"));
class RequestQueue extends request_queue_1.RequestQueue {
    _requestQueueStore;
    _requestQueueHistoryStore;
    constructor(options) {
        super(options);
        this._requestQueueStore = core__store__data_1.default.create({ name: `rq-${options?.name || 'default'}`, key: 'request-queue', adapter: (0, adapter__kv_store__apify_1.default)() });
        this._requestQueueHistoryStore = core__store__data_1.default.create({
            name: `rqh-${options?.name || 'default'}`,
            key: 'request-queue-history',
            adapter: (0, adapter__kv_store__apify_1.default)(),
        });
        core__store__data_1.default.listen(this._requestQueueStore);
        core__store__data_1.default.listen(this._requestQueueHistoryStore);
    }
    async addRequest(request, options) {
        const { priority = Infinity, crawlerOptions, ...restOptions } = options || {};
        const reqQueueStore = await core__store__data_1.default.load(this._requestQueueStore);
        const meta = core__request_meta_1.default.extend(core__request_meta_1.default.create(request), { crawlerOptions });
        const requestInfo = await super.addRequest(meta.request, restOptions);
        core__store__data_1.default.set(reqQueueStore, requestInfo.requestId, priority);
        return requestInfo;
    }
    async markRequestHandled(request) {
        const reqQueueHistoryStore = await core__store__data_1.default.load(this._requestQueueStore);
        core__store__data_1.default.remove(reqQueueHistoryStore, request.id);
        return super.markRequestHandled(request);
    }
    async reclaimRequest(request, options = {}) {
        const reqQueueHistoryStore = await core__store__data_1.default.load(this._requestQueueStore);
        const localRequest = core__store__data_1.default.get(reqQueueHistoryStore, request.id);
        if (localRequest) {
            localRequest.retryCount++;
        }
        const queueOperationInfo = super.reclaimRequest(localRequest || request, options);
        return queueOperationInfo;
    }
    async fetchNextRequest() {
        const reqQueueStore = await core__store__data_1.default.load(this._requestQueueStore);
        const reqQueueHistoryStore = await core__store__data_1.default.load(this._requestQueueHistoryStore);
        const smallestPriority = Math.min(...core__store__data_1.default.values(reqQueueStore));
        const [requestId] = core__store__data_1.default.entries(reqQueueStore).find(([, priority]) => priority === smallestPriority) || [];
        if (requestId) {
            core__store__data_1.default.set(reqQueueHistoryStore, requestId, core__store__data_1.default.get(reqQueueStore, requestId));
            core__store__data_1.default.remove(reqQueueStore, requestId);
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
//# sourceMappingURL=index.js.map