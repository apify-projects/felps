import * as FT from '@usefelps/types';
export declare const create: (element: {
    id: string;
}, options?: FT.LoggerOptions) => FT.LoggerInstance;
export declare const setLevel: (level: 'ERROR' | 'DEBUG' | 'INFO') => void;
export declare const createPrefix: (logger: FT.LoggerInstance, icon: string, id: string) => string;
export declare const createLog: (method: string, icon: string) => (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
export declare const debug: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
export declare const start: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
export declare const end: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
export declare const info: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
export declare const error: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
declare const _default: {
    create: (element: {
        id: string;
    }, options?: FT.LoggerOptions) => FT.LoggerInstance;
    setLevel: (level: "ERROR" | "DEBUG" | "INFO") => void;
    debug: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
    start: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
    end: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
    info: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
    error: (logger: FT.LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
};
export default _default;
//# sourceMappingURL=index.d.ts.map