import Apify from 'apify';
import { FileStoreInstance, FileStoreOptions } from './types';
export declare const create: (options: FileStoreOptions) => FileStoreInstance;
export declare const load: (fileStore: FileStoreInstance) => Promise<FileStoreInstance>;
export declare const get: (fileStore: FileStoreInstance, key: string) => Promise<Apify.KeyValueStoreValueTypes | undefined>;
export declare const set: <TValue extends object = any>(fileStore: FileStoreInstance, key: string, value: TValue, options?: {
    contentType?: string | undefined;
} | undefined) => Promise<void | undefined>;
declare const _default: {
    create: (options: FileStoreOptions) => FileStoreInstance;
    load: (fileStore: FileStoreInstance) => Promise<FileStoreInstance>;
    get: (fileStore: FileStoreInstance, key: string) => Promise<Apify.KeyValueStoreValueTypes | undefined>;
    set: <TValue extends object = any>(fileStore: FileStoreInstance, key: string, value: TValue, options?: {
        contentType?: string | undefined;
    } | undefined) => Promise<void | undefined>;
};
export default _default;
//# sourceMappingURL=file-store.d.ts.map