"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.DefaultQueueCollection = void 0;
const tslib_1 = require("tslib");
const core__queue_1 = tslib_1.__importDefault(require("@usefelps/core--queue"));
exports.DefaultQueueCollection = {
    default: core__queue_1.default.create(),
};
const create = (options) => {
    const { names = [] } = options || {};
    return names.reduce((queues, name) => ({
        ...queues,
        [name]: core__queue_1.default.create({ name }),
    }), exports.DefaultQueueCollection);
};
exports.create = create;
exports.default = { create: exports.create, DefaultQueueCollection: exports.DefaultQueueCollection };
//# sourceMappingURL=index.js.map