import { KeyValueStore } from '@crawlee/core';
import InstanceBase from '@usefelps/instance-base';
import { BucketInstance, BucketOptions, ReallyAny } from '@usefelps/types';

export const create = (options: BucketOptions): BucketInstance => {
    const { name, kvKey, key = 'bucket' } = options || {};
    return {
        type: 'bucket',
        ...InstanceBase.create({ name, key }),
        kvKey: kvKey || name,
        resource: undefined,
        initialized: false,
        stats: { reads: 0, writes: 0 },
    };
};

export const load = async (Bucket: BucketInstance): Promise<BucketInstance> => {
    if (Bucket.resource) return Bucket;

    return {
        ...Bucket,
        initialized: true,
        resource: await KeyValueStore.open(Bucket.kvKey),
    };
};

export const get = async (Bucket: BucketInstance, key: string) => {
    const loaded = await load(Bucket);
    Bucket.stats.reads++;
    return loaded.resource?.getValue(key);
};

export const set = async <TValue extends object = ReallyAny>(Bucket: BucketInstance, key: string, value: TValue, options?: { contentType?: string; }) => {
    const loaded = await load(Bucket);
    Bucket.stats.writes++;
    return loaded.resource?.setValue(key, value, options);
};

export default { create, load, get, set };
