import { UrlPatternInstance, UrlPatternOptions, UrlPatternParsed } from './types';
export declare const create: (options: UrlPatternOptions) => UrlPatternInstance;
export declare const parse: (urlPattern: UrlPatternInstance, url: string) => UrlPatternParsed | undefined;
export declare const stringify: (urlPattern: UrlPatternInstance, data: Record<string, string>) => string | false;
export declare const find: (urlPatterns: UrlPatternInstance[], url: string) => UrlPatternInstance | void;
export declare const parseAny: (urlPatterns: UrlPatternInstance[], url: string) => UrlPatternParsed | undefined;
declare const _default: {
    create: (options: UrlPatternOptions) => UrlPatternInstance;
    parse: (urlPattern: UrlPatternInstance, url: string) => UrlPatternParsed | undefined;
    parseAny: (urlPatterns: UrlPatternInstance[], url: string) => UrlPatternParsed | undefined;
    stringify: (urlPattern: UrlPatternInstance, data: Record<string, string>) => string | false;
    find: (urlPatterns: UrlPatternInstance[], url: string) => void | UrlPatternInstance;
};
export default _default;
//# sourceMappingURL=url-pattern.d.ts.map