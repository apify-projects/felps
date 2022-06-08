import { UrlPatternInstance, UrlPatternOptions, UrlPatternParsed } from '@usefelps/types';
export declare const create: (options: UrlPatternOptions) => UrlPatternInstance;
export declare const parse: (urlPattern: UrlPatternInstance, url: string) => UrlPatternParsed | undefined;
export declare const stringify: (urlPattern: UrlPatternInstance, data: Record<string, string>) => any;
export declare const find: (urlPatterns: UrlPatternInstance[], url: string) => UrlPatternInstance | void;
export declare const parseAny: (urlPatterns: UrlPatternInstance[], url: string) => UrlPatternParsed | undefined;
declare const _default: {
    create: (options: UrlPatternOptions) => UrlPatternInstance;
    parse: (urlPattern: UrlPatternInstance, url: string) => UrlPatternParsed;
    parseAny: (urlPatterns: UrlPatternInstance[], url: string) => UrlPatternParsed;
    stringify: (urlPattern: UrlPatternInstance, data: Record<string, string>) => any;
    find: (urlPatterns: UrlPatternInstance[], url: string) => void | UrlPatternInstance;
};
export default _default;
//# sourceMappingURL=index.d.ts.map