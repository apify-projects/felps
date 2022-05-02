"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
const storage_manager_1 = require("apify/build/storages/storage_manager");
const base_1 = tslib_1.__importDefault(require("./base"));
const utils_1 = require("./utils");
const logger_1 = tslib_1.__importDefault(require("./logger"));
const request_queue_1 = tslib_1.__importDefault(require("./sdk/request-queue"));
const request_meta_1 = tslib_1.__importDefault(require("./request-meta"));
const create = (options) => {
    const { name } = options || {};
    return {
        ...base_1.default.create({ key: 'queue', name: name }),
        resource: undefined,
    };
};
exports.create = create;
const load = async (queue, options) => {
    if (queue.resource)
        return queue;
    const manager = new storage_manager_1.StorageManager(request_queue_1.default);
    const resource = await manager.openStorage(queue.name, options);
    return {
        ...queue,
        ...base_1.default.create({ key: 'queue', name: queue.name, id: resource.id }),
        resource,
    };
};
exports.load = load;
const add = async (queue, request, options) => {
    const meta = request_meta_1.default.create(request);
    const loaded = await (0, exports.load)(queue);
    if (!loaded?.resource) {
        throw new Error('Queue not loaded');
    }
    logger_1.default.info(logger_1.default.create(queue), `Queueing ${request.url} request for: ${meta.data.stepName}.`);
    return loaded.resource.addRequest({ uniqueKey: (0, utils_1.craftUIDKey)('req', 6), ...request }, options);
};
exports.add = add;
exports.default = { create: exports.create, load: exports.load, add: exports.add };
//# sourceMappingURL=queue.js.map