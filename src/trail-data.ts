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

export const getPath = <T = unknown>(trailData: TrailDataInstance, ref: Partial<ModelReference<T>>): string => {
    return pathify(trailData.path, ref?.requestKey);
};

export default { getPath, defaultUpdateMerger };
