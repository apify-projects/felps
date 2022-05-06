"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAll = exports.onIntervals = exports.onShutdown = exports.onPersistState = exports.onAborting = exports.onMigrating = void 0;
const tslib_1 = require("tslib");
const apify_1 = tslib_1.__importDefault(require("apify"));
const lodash_throttle_1 = tslib_1.__importDefault(require("lodash.throttle"));
/**
 * This is far from perfect.
 */
const throttleListener = (handler) => {
    // Throttle the handler to avoid calling it too often.
    // Not sure if async really works there, TBC.
    return (0, lodash_throttle_1.default)(handler, 5000, { trailing: false });
};
const onMigrating = (handler) => {
    apify_1.default.events.on('migrating', throttleListener(handler));
};
exports.onMigrating = onMigrating;
const onAborting = (handler) => {
    apify_1.default.events.on('aborting', throttleListener(handler));
};
exports.onAborting = onAborting;
const onPersistState = (handler) => {
    apify_1.default.events.on('persistState', ({ isMigrating }) => {
        if (!isMigrating)
            throttleListener(handler);
    });
};
exports.onPersistState = onPersistState;
const onShutdown = (handler) => {
    (0, exports.onMigrating)(handler);
    (0, exports.onAborting)(handler);
};
exports.onShutdown = onShutdown;
const onIntervals = (handler) => {
    (0, exports.onPersistState)(handler);
};
exports.onIntervals = onIntervals;
const onAll = (handler) => {
    (0, exports.onShutdown)(handler);
    (0, exports.onIntervals)(handler);
};
exports.onAll = onAll;
exports.default = { onMigrating: exports.onMigrating, onAborting: exports.onAborting, onPersistState: exports.onPersistState, onShutdown: exports.onShutdown, onIntervals: exports.onIntervals, onAll: exports.onAll };
//# sourceMappingURL=apify-events.js.map