import Apify from 'apify';
import base from './base';
import { FileStoreInstance, FileStoreOptions, reallyAny } from './types';

export const create = (options: FileStoreOptions): FileStoreInstance => {
    const { name, kvKey, key = 'file-store' } = options || {};
    return {
        type: 'file-store',
        ...base.create({ name, key }),
        kvKey: kvKey || name,
        resource: undefined,
        initialized: false,
    };
};

export const load = async (fileStore: FileStoreInstance): Promise<FileStoreInstance> => {
    if (fileStore.resource) return fileStore;

    return {
        ...fileStore,
        initialized: true,
        resource: await Apify.openKeyValueStore(fileStore.kvKey),
    };
};

export const get = async (fileStore: FileStoreInstance, key: string) => {
    const loaded = await load(fileStore);
    return loaded.resource?.getValue(key);
};

export const set = async <TValue extends object = reallyAny>(fileStore: FileStoreInstance, key: string, value: TValue, options?: { contentType?: string; }) => {
    const loaded = await load(fileStore);
    return loaded.resource?.setValue(key, value, options);
};

export default { create, load, get, set };
