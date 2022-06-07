import { URL } from 'node:url';
import Route from 'route-parser';
import Base  from '@usefelps/core--instance-base';
import { UrlPatternInstance, UrlPatternOptions, UrlPatternParsed } from '@usefelps/types';

export const create = (options: UrlPatternOptions): UrlPatternInstance => {
    const { name, pattern } = options;

    return {
        ...Base.create({ key: 'search', name: name || 'default' }),
        pattern,
        resource: new Route(pattern),
    };
};

export const parse = (urlPattern: UrlPatternInstance, url: string): UrlPatternParsed | undefined => {
    try {
        const link = new URL(url);
        const matched = urlPattern.resource.match(link.pathname) as Record<string, string | number>;
        if (!matched) return;
        return {
            origin: link.origin,
            pathParams: matched || {},
            searchParams: Object.fromEntries(link.searchParams.entries()),
        };
    } catch (error) {
        return undefined;
    }
};

export const stringify = (urlPattern: UrlPatternInstance, data: Record<string, string>) => {
    return urlPattern.resource.reverse(data);
};

export const find = (urlPatterns: UrlPatternInstance[], url: string): UrlPatternInstance | void => {
    for (const urlPattern of urlPatterns) {
        const parsed = parse(urlPattern, url);
        if (parsed) {
            return urlPattern;
        }
    }
};

export const parseAny = (urlPatterns: UrlPatternInstance[], url: string): UrlPatternParsed | undefined => {
    for (const urlPattern of urlPatterns) {
        const parsed = parse(urlPattern, url);
        if (parsed) {
            return parsed;
        }
    }
    return undefined;
};

export default { create, parse, parseAny, stringify, find };
