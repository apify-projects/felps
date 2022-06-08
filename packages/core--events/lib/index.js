"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.batch = exports.once = exports.on = exports.emit = exports.create = void 0;
const tslib_1 = require("tslib");
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const queue_1 = tslib_1.__importDefault(require("queue"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const apify__events_1 = tslib_1.__importDefault(require("@usefelps/apify--events"));
const create = (options) => {
    return {
        ...core__instance_base_1.default.create({ key: 'events', name: options?.name || 'default' }),
        resource: new eventemitter3_1.default(),
        queues: [],
        batchSize: options?.batchSize || 10,
        batchMinIntervals: options?.batchMinIntervals || 5000,
    };
};
exports.create = create;
const emit = (events, eventName, ...args) => {
    events.resource.emit(eventName, ...args);
};
exports.emit = emit;
const on = (events, eventName, callback) => {
    events.resource.on(eventName, callback);
};
exports.on = on;
const once = (events, eventName, callback) => {
    events.resource.once(eventName, callback);
};
exports.once = once;
const batch = (events, eventName, callback, options) => {
    const { size = events.batchSize } = options || {};
    const stack = [];
    const q = new queue_1.default({ concurrency: 1, autostart: true });
    events.queues.push(q);
    apify__events_1.default.onShutdown(async () => {
        await processor(true);
    });
    const processor = async (forceAll = false) => {
        if (forceAll) {
            await Promise.resolve(callback(stack.splice(0, stack.length)));
        }
        else if (stack.length >= size) {
            await Promise.resolve(callback(stack.splice(0, size)));
        }
    };
    const enqueue = (forceAll = false) => q.push(async () => processor(forceAll));
    events.resource.on(eventName, (event) => {
        stack.push(event);
        enqueue();
    });
};
exports.batch = batch;
const close = async (events) => {
    await Promise.allSettled(events.queues.map((q) => new Promise((resolve) => {
        if (!q.length)
            return resolve(undefined);
        q.on('end', resolve);
    })));
};
exports.close = close;
exports.default = { create: exports.create, emit: exports.emit, on: exports.on, once: exports.once, batch: exports.batch, close: exports.close };
//# sourceMappingURL=index.js.map