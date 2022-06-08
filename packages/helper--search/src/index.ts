import { Index } from 'flexsearch';
import getByKey from 'lodash.get';
import Base from '@usefelps/core--instance-base';
import * as FT from '@usefelps/types';

export const create = (options: FT.SearchOptions) => {
    const { name, indexOptions, documentOptions } = options || {};

    return {
        ...Base.create({ key: 'search', name: name || 'default' }),
        indexOptions,
        documentOptions,
    };
};

export const withinTextsAsIndexes = (search: FT.SearchInstance, items: string[], query: string): (number | string)[] => {
    const index = new Index(search.indexOptions);
    for (const [idx, item] of Object.entries(items)) {
        index.add(idx, item);
    };
    return index.search(query);
};

export const withinTexts = (search: FT.SearchInstance, items: string[], query: string): string[] => {
    return withinTextsAsIndexes(search, items, query).map((idx) => items[+idx]);
};

export const withinObjects = <T extends Record<string, FT.ReallyAny>>(search: FT.SearchInstance, path: string, items: T[], query: string): T[] => {
    const indexes = withinTextsAsIndexes(search, items.map((item) => getByKey(item, path)), query);
    return indexes.map((idx) => items[+idx]);
};

export default { create, withinObjects, withinTexts, withinTextsAsIndexes };
