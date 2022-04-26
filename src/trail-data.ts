/* eslint-disable max-len */
import { ModelReference, reallyAny, TrailDataInstance, UniqueyKey } from './types';
import { concatAsUniqueArray, pathify } from './utils';

export const defaultUpdateMerger = (existingValue: reallyAny, newValue: reallyAny) => {
    if (!newValue && typeof existingValue !== 'number') return existingValue;
    if (Array.isArray(newValue)) {
        return concatAsUniqueArray(existingValue, newValue);
    }
    return undefined;
};

export const getPath = <T = unknown>(trailData: TrailDataInstance, ref: ModelReference<T>, ...segments: string[]): string => {
    const referenceKey = trailData?.referenceKey as string;
    const key = (ref as reallyAny)?.[referenceKey] as UniqueyKey;
    if (!key) {
        throw new Error(`No reference key found for ${JSON.stringify(ref)}`);
    }
    return pathify(trailData.path, key, ...segments);
};

export default { getPath, defaultUpdateMerger };
