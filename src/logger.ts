import Apify from 'apify';
import EventEmitter from 'events';
import { LoggerInstance, LoggerOptions } from './common/types';

const loggerEvents = new EventEmitter();
loggerEvents.setMaxListeners(8000);

export const create = (element: { id: string }, options?: LoggerOptions): LoggerInstance => {
    const { suffix, level = Apify.utils.log.LEVELS.INFO } = options || {};

    const logger = Apify.utils.log;
    logger.setLevel(level);
    loggerEvents.on('mode', (newLevel) => { logger.setLevel(newLevel); });

    return {
        elementId: element.id,
        suffix,
        level,
        apifyLogger: logger,
    };
};

export const setDebug = () => {
    loggerEvents.emit('mode', Apify.utils.log.LEVELS.DEBUG);
};

export const setInfo = () => {
    loggerEvents.emit('mode', Apify.utils.log.LEVELS.INFO);
};

export const createPrefix = (logger: LoggerInstance, icon: string, id: string) => {
    return `${icon} (${id}${logger.suffix ? `:${logger.suffix}` : ''})`;
};

export const createLog = (method: string, icon: string) => (logger: LoggerInstance, messages?: string | string[], data?: Record<string, any>) => {
    const prefix = createPrefix(logger, icon, logger.elementId);
    const text = (Array.isArray(messages) ? messages : [messages]).filter(Boolean).map((message) => `      -- ${message}`).join('\n');
    logger.apifyLogger[method](`${prefix}${text ? `\n ${text}` : ''}`, data);
};

export const debug = createLog('debug', '[?!]');

export const start = createLog('info', '[>]');

export const end = createLog('info', '[<]');

export const info = createLog('info', '[i]');

export const error = createLog('error', '[!]');

export default {
    create,
    setDebug,
    setInfo,
    debug,
    start,
    end,
    info,
    error,
};
