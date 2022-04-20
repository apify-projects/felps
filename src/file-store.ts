import Apify from 'apify';
import { curry, curryN } from 'rambda';
import { FileStoreInstance, FileStoreOptions } from './common/types';
import base from './base';

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

export const get = curryN(2, async (fileStore: FileStoreInstance, key: string) => {
    const loaded = await load(fileStore);
    return loaded.resource.getValue(key);
});

export const set = curry(async (fileStore: FileStoreInstance, key: string, value: unknown, options?: { contentType?: string; }) => {
    const loaded = await load(fileStore);
    return loaded.resource.setValue(key, value, options);
});

export default { create, load, get, set };
