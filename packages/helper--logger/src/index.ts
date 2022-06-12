import * as FT from '@usefelps/types';
import { createLogger, format, transports as defaultTransports } from 'winston';

export const defaultLevels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
};

export const create = (parent: { id: string }, options?: FT.LoggerOptions): FT.LoggerInstance => {
    const { suffix, level = 'info', levels = defaultLevels } = options || {};
    let { transports } = options || {};

    transports ||= [new defaultTransports.Console({ level: 'info', format: format.combine(format.colorize(), format.simple()) })]

    const resource = createLogger({
        level,
        levels,
        // format: format.json(),
        transports,
    });

    return {
        parent,
        suffix,
        levels,
        level,
        resource,
    };
};

export const setLevel = (logger: FT.LoggerInstance, level: keyof typeof logger.levels) => {
    logger.resource.level = level;
};

export const log = (logger: FT.LoggerInstance, level: keyof typeof logger.levels, message: string, ...meta: any[]) => {
    logger.resource?.[level]?.(message, ...meta);
}

export const emerg = (logger: FT.LoggerInstance, message: string, ...meta: any[]) => log(logger, 'emerg', message, meta);
export const alert = (logger: FT.LoggerInstance, message: string, ...meta: any[]) => log(logger, 'alert', message, meta);
export const crit = (logger: FT.LoggerInstance, message: string, ...meta: any[]) => log(logger, 'crit', message, meta);
export const error = (logger: FT.LoggerInstance, message: string, ...meta: any[]) => log(logger, 'error', message, meta);
export const warning = (logger: FT.LoggerInstance, message: string, ...meta: any[]) => log(logger, 'warning', message, meta);
export const notice = (logger: FT.LoggerInstance, message: string, ...meta: any[]) => log(logger, 'notice', message, meta);
export const info = (logger: FT.LoggerInstance, message: string, ...meta: any[]) => log(logger, 'info', message, meta);
export const debug = (logger: FT.LoggerInstance, message: string, ...meta: any[]) => log(logger, 'debug', message, meta);

export default {
    create,
    setLevel,
    log,
    emerg,
    alert,
    crit,
    error,
    warning,
    notice,
    info,
    debug,
};
