import Apify from 'apify';
import { curry, curryN } from 'rambda';
import { FileStoreInstance, FileStoreOptions } from './common/types';
import base from './base';

export const create = (options: FileStoreOptions): FileStoreInstance => {
    const { name, key = 'file-store' } = options || {};
    return {
        ...base.create({ name, key }),
        resource: undefined,
        initialized: false,
    };
};

export const load = async (fileStore: FileStoreInstance): Promise<FileStoreInstance> => {
    if (fileStore.resource) return fileStore;

    return {
        ...fileStore,
        resource: await Apify.openKeyValueStore(fileStore.name),
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
