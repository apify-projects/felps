import { SearchInstance, SearchOptions } from './types';
export declare const create: (options: SearchOptions) => {
    indexOptions: import("flexsearch").IndexOptions<string, false> | undefined;
    documentOptions: import("flexsearch").IndexOptionsForDocumentSearch<unknown, false> | undefined;
    uid?: string | undefined;
    key?: string | undefined;
    name: string;
    id: string;
};
export declare const withinTextsAsIndexes: (search: SearchInstance, items: string[], query: string) => (number | string)[];
export declare const withinTexts: (search: SearchInstance, items: string[], query: string) => string[];
export declare const withinObjects: <T extends Record<string, any>>(search: SearchInstance, path: string, items: T[], query: string) => T[];
declare const _default: {
    create: (options: SearchOptions) => {
        indexOptions: import("flexsearch").IndexOptions<string, false> | undefined;
        documentOptions: import("flexsearch").IndexOptionsForDocumentSearch<unknown, false> | undefined;
        uid?: string | undefined;
        key?: string | undefined;
        name: string;
        id: string;
    };
    withinObjects: <T extends Record<string, any>>(search: SearchInstance, path: string, items: T[], query: string) => T[];
    withinTexts: (search: SearchInstance, items: string[], query: string) => string[];
    withinTextsAsIndexes: (search: SearchInstance, items: string[], query: string) => (string | number)[];
};
export default _default;
//# sourceMappingURL=search.d.ts.map