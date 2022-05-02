"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.DefaultQueues = void 0;
const tslib_1 = require("tslib");
const queue_1 = tslib_1.__importDefault(require("./queue"));
exports.DefaultQueues = {
    default: queue_1.default.create(),
};
const create = (options) => {
    const { names = [] } = options || {};
    return names.reduce((queues, name) => ({
        ...queues,
        [name]: queue_1.default.create({ name }),
    }), exports.DefaultQueues);
};
exports.create = create;
exports.default = { create: exports.create, DefaultQueues: exports.DefaultQueues };
//# sourceMappingURL=queues.js.map