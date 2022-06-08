"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = exports.load = exports.create = void 0;
const tslib_1 = require("tslib");
const storage_manager_1 = require("apify/build/storages/storage_manager");
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const helper__logger_1 = tslib_1.__importDefault(require("@usefelps/helper--logger"));
const custom__request_queue_1 = tslib_1.__importDefault(require("@usefelps/custom--request-queue"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const helper__utils_1 = require("@usefelps/helper--utils");
const create = (options) => {
    const { name } = options || {};
    return {
        ...core__instance_base_1.default.create({ key: 'queue', name: name }),
        resource: undefined,
    };
};
exports.create = create;
const load = async (queue, options) => {
    if (queue.resource)
        return queue;
    const manager = new storage_manager_1.StorageManager(custom__request_queue_1.default);
    const resource = await manager.openStorage(queue.name, options);
    return {
        ...queue,
        ...core__instance_base_1.default.create({ key: 'queue', name: queue.name, id: resource.id }),
        resource,
    };
};
exports.load = load;
const add = async (queue, request, options) => {
    const meta = core__request_meta_1.default.create(request);
    const loaded = await (0, exports.load)(queue);
    if (!loaded?.resource)
        throw new Error('Queue not loaded');
    helper__logger_1.default.info(helper__logger_1.default.create(queue), `Queueing ${request.url} request for: ${meta.data.stepName}.`);
    const priority = meta.data.reference.fTrailKey ? (0, helper__utils_1.getUIDKeyTime)(meta.data.reference.fTrailKey) : undefined;
    return loaded.resource.addRequest({ uniqueKey: (0, helper__utils_1.craftUIDKey)('req', 6), ...request }, { priority, ...options });
};
exports.add = add;
exports.default = { create: exports.create, load: exports.load, add: exports.add };
//# sourceMappingURL=index.js.map