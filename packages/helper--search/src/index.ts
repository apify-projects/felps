import { Index } from 'flexsearch';
import getByKey from 'lodash.get';
import Base from '@usefelps/core--instance-base';
import { ReallyAny, SearchInstance, SearchOptions } from '@usefelps/types';

export const create = (options: SearchOptions) => {
    const { name, indexOptions, documentOptions } = options || {};

    return {
        ...Base.create({ key: 'search', name: name || 'default' }),
        indexOptions,
        documentOptions,
    };
};

export const withinTextsAsIndexes = (search: SearchInstance, items: string[], query: string): (number | string)[] => {
    const index = new Index(search.indexOptions);
    for (const [idx, item] of Object.entries(items)) {
        index.add(idx, item);
    };
    return index.search(query);
};

export const withinTexts = (search: SearchInstance, items: string[], query: string): string[] => {
    return withinTextsAsIndexes(search, items, query).map((idx) => items[+idx]);
};

export const withinObjects = <T extends Record<string, ReallyAny>>(search: SearchInstance, path: string, items: T[], query: string): T[] => {
    const indexes = withinTextsAsIndexes(search, items.map((item) => getByKey(item, path)), query);
    return indexes.map((idx) => items[+idx]);
};

// export const withinObjects = <T extends Record<string, ReallyAny>>(search: SearchInstance, items: T[], query: string): T[] => {
//     const index = new Document(search.documentOptions);
//     for (const [idx, item] of Object.entries(items)) {
//         index.add(idx, item);
//     };
//     const sortedByFields = index.search(query);
//     // TODO: To improve!
//     const indexes = sortedByFields.map((item) => item.result).flat();
//     return indexes.map((idx) => items[+idx]);
// };

export default { create, withinObjects, withinTexts, withinTextsAsIndexes };
