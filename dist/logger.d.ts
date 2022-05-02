import { LoggerInstance, LoggerOptions } from './types';
export declare const create: (element: {
    id: string;
}, options?: LoggerOptions | undefined) => LoggerInstance;
export declare const setDebug: () => void;
export declare const setInfo: () => void;
export declare const createPrefix: (logger: LoggerInstance, icon: string, id: string) => string;
export declare const createLog: (method: string, icon: string) => (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
export declare const debug: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
export declare const start: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
export declare const end: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
export declare const info: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
export declare const error: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
declare const _default: {
    create: (element: {
        id: string;
    }, options?: LoggerOptions | undefined) => LoggerInstance;
    setDebug: () => void;
    setInfo: () => void;
    debug: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
    start: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
    end: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
    info: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
    error: (logger: LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
};
export default _default;
//# sourceMappingURL=logger.d.ts.map