import { KeyValueStore } from '@crawlee/core';
import Base from '@usefelps/core--instance-base';
import { FileStoreInstance, FileStoreOptions, ReallyAny } from '@usefelps/types';

export const create = (options: FileStoreOptions): FileStoreInstance => {
    const { name, kvKey, key = 'file-store' } = options || {};
    return {
        type: 'file-store',
        ...Base.create({ name, key }),
        kvKey: kvKey || name,
        resource: undefined,
        initialized: false,
        stats: { reads: 0, writes: 0 },
    };
};

export const load = async (fileStore: FileStoreInstance): Promise<FileStoreInstance> => {
    if (fileStore.resource) return fileStore;

    return {
        ...fileStore,
        initialized: true,
        resource: await KeyValueStore.open(fileStore.kvKey),
    };
};

export const get = async (fileStore: FileStoreInstance, key: string) => {
    const loaded = await load(fileStore);
    fileStore.stats.reads++;
    return loaded.resource?.getValue(key);
};

export const set = async <TValue extends object = ReallyAny>(fileStore: FileStoreInstance, key: string, value: TValue, options?: { contentType?: string; }) => {
    const loaded = await load(fileStore);
    fileStore.stats.writes++;
    return loaded.resource?.setValue(key, value, options);
};

export default { create, load, get, set };
