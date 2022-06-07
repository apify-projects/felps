/* eslint-disable max-len */
import { ModelReference, ReallyAny, TrailDataInstance, UniqueyKey } from '@usefelps/types';
import { concatAsUniqueArray, pathify } from '@usefelps/helper--utils';

export const defaultUpdateMerger = (existingValue: ReallyAny, newValue: ReallyAny) => {
    if (!newValue && typeof existingValue !== 'number') return existingValue;
    if (Array.isArray(newValue)) {
        return concatAsUniqueArray(existingValue, newValue);
    }
    return undefined;
};

export const getPath = <T = unknown>(trailData: TrailDataInstance, ref: ModelReference<T>, ...segments: string[]): string => {
    const referenceKey = trailData?.referenceKey as string;
    const key = (ref as ReallyAny)?.[referenceKey] as UniqueyKey;
    if (!key) {
        throw new Error(`No reference key ${referenceKey} found for ${JSON.stringify(ref)}`);
    }
    return pathify(trailData.path, key, ...segments);
};

export default { getPath, defaultUpdateMerger };
