/* eslint-disable max-len */
import { ModelReference, TrailDataInstance } from './common/types';
import { concatAsUniqueArray, pathify } from './common/utils';

export const defaultUpdateMerger = (existingValue, newValue) => {
    if (!newValue && typeof existingValue !== 'number') return existingValue;
    if (Array.isArray(newValue)) {
        return concatAsUniqueArray(existingValue, newValue);
    }
    return undefined;
};

export const getPath = <T = unknown>(trailData: TrailDataInstance, ref: ModelReference<T>): string => {
    const key = ref?.[trailData.referenceKey];
    if (!key) {
        throw new Error(`No reference key found for ${JSON.stringify(ref)}`);
    }
    return pathify(trailData.path, key);
};

export default { getPath, defaultUpdateMerger };
