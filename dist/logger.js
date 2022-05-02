"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.info = exports.end = exports.start = exports.debug = exports.createLog = exports.createPrefix = exports.setInfo = exports.setDebug = exports.create = void 0;
const tslib_1 = require("tslib");
const apify_1 = tslib_1.__importDefault(require("apify"));
const events_1 = tslib_1.__importDefault(require("events"));
const loggerEvents = new events_1.default();
loggerEvents.setMaxListeners(8000);
const create = (element, options) => {
    const { suffix, level = apify_1.default.utils.log.LEVELS.INFO } = options || {};
    const logger = apify_1.default.utils.log;
    logger.setLevel(level);
    loggerEvents.on('mode', (newLevel) => { logger.setLevel(newLevel); });
    return {
        elementId: element.id,
        suffix,
        level,
        apifyLogger: logger,
    };
};
exports.create = create;
const setDebug = () => {
    loggerEvents.emit('mode', apify_1.default.utils.log.LEVELS.DEBUG);
};
exports.setDebug = setDebug;
const setInfo = () => {
    loggerEvents.emit('mode', apify_1.default.utils.log.LEVELS.INFO);
};
exports.setInfo = setInfo;
const createPrefix = (logger, icon, id) => {
    return `[${icon} ${id}${logger.suffix ? `:${logger.suffix}` : ''}]`;
};
exports.createPrefix = createPrefix;
const createLog = (method, icon) => (logger, messages, data) => {
    const prefix = (0, exports.createPrefix)(logger, icon, logger.elementId);
    const text = (Array.isArray(messages) ? messages : [messages]).filter(Boolean).map((message) => `      -- ${message}`).join('\n');
    logger.apifyLogger[method](`${prefix}${text ? `\n ${text}` : ''}`, data);
};
exports.createLog = createLog;
exports.debug = (0, exports.createLog)('debug', '?!');
exports.start = (0, exports.createLog)('info', '>');
exports.end = (0, exports.createLog)('info', '<');
exports.info = (0, exports.createLog)('info', 'i');
exports.error = (0, exports.createLog)('error', '!');
exports.default = {
    create: exports.create,
    setDebug: exports.setDebug,
    setInfo: exports.setInfo,
    debug: exports.debug,
    start: exports.start,
    end: exports.end,
    info: exports.info,
    error: exports.error,
};
//# sourceMappingURL=logger.js.map