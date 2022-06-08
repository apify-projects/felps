import * as FT from '@usefelps/types';
export declare const create: (options: FT.SearchOptions) => {
    indexOptions: import("flexsearch").IndexOptions<string, false>;
    documentOptions: import("flexsearch").IndexOptionsForDocumentSearch<unknown, false>;
    uid?: string;
    key?: string;
    name: string;
    id: string;
};
export declare const withinTextsAsIndexes: (search: FT.SearchInstance, items: string[], query: string) => (number | string)[];
export declare const withinTexts: (search: FT.SearchInstance, items: string[], query: string) => string[];
export declare const withinObjects: <T extends Record<string, any>>(search: FT.SearchInstance, path: string, items: T[], query: string) => T[];
declare const _default: {
    create: (options: FT.SearchOptions) => {
        indexOptions: import("flexsearch").IndexOptions<string, false>;
        documentOptions: import("flexsearch").IndexOptionsForDocumentSearch<unknown, false>;
        uid?: string;
        key?: string;
        name: string;
        id: string;
    };
    withinObjects: <T extends Record<string, any>>(search: FT.SearchInstance, path: string, items: T[], query: string) => T[];
    withinTexts: (search: FT.SearchInstance, items: string[], query: string) => string[];
    withinTextsAsIndexes: (search: FT.SearchInstance, items: string[], query: string) => (string | number)[];
};
export default _default;
//# sourceMappingURL=index.d.ts.map