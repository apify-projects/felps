/* eslint-disable max-len */
import { REFERENCE_KEY } from '../common/consts';
import { References, TrailDataInstance, TrailDataOptions, TrailModelPathsMethods, TrailModelPathsOptions } from '../common/types';
import { concatAsUniqueArray, pathify } from '../common/utils';
import base from './base';
import dataStore from './data-store';

export const DefaultUpdateMerger = (existingValue, newValue) => {
    if (!newValue && typeof existingValue !== 'number') return existingValue;
    if (Array.isArray(newValue)) {
        return concatAsUniqueArray(existingValue, newValue);
    }
    return undefined;
};

export const create = <ReferenceType = Record<string, unknown>>(options?: TrailDataOptions): TrailDataInstance<ReferenceType> => {
    const { path, model, store } = options;
    const referenceKey = REFERENCE_KEY(model.name);
    const fragments = getTrailDataFragments<ReferenceType>({ name: model.name, path });

    return {
        ...base.create({ key: 'store-trail-data', name: 'trail-data' }),
        referenceKey,
        path,
        fragments,
        model,
        store,
    };
};

export const getPath = <T>(trailData: TrailDataInstance<T>, ref: References<T>): string => trailData.fragments.ITEMS(ref);
export const getReferencePath = <T>(trailData: TrailDataInstance<T>, ref: References<T>): string => trailData.fragments.ITEM_REFERENCE(ref);
export const getRequestPath = <T>(trailData: TrailDataInstance<T>, ref: References<T>): string => trailData.fragments.ITEM_REQUEST(ref);
export const getListingRequestPath = <T>(trailData: TrailDataInstance<T>, ref: References<T>): string => trailData.fragments.LISTING_REQUEST(ref);
export const get = <T>(trailData: TrailDataInstance<T>, ref: References<T>): string => dataStore.get(trailData.store, getPath(trailData, ref));

const getTrailDataFragments = <ReferenceType extends Record<string, unknown> = Record<string, unknown>
>(options: TrailModelPathsOptions): TrailModelPathsMethods<ReferenceType> => {
    const { name, path } = options;

    const basePath = pathify(path, name);
    const referenceKey = REFERENCE_KEY(name);

    return {
        ITEMS: (reference) => pathify(basePath, 'items', reference?.[referenceKey]),
        ITEM_REQUEST: (reference) => pathify(basePath, 'items', reference?.[referenceKey], 'request'),
        ITEM_DATA: (reference) => pathify(basePath, 'items', reference?.[referenceKey], 'data'),
        ITEM_REFERENCE: (reference) => pathify(basePath, 'items', reference?.[referenceKey], 'reference'),
        LISTING_REQUEST: (reference) => pathify(basePath, 'listingRequests', reference?.[referenceKey]),
    };
};

export default { create };
