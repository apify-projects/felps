import Apify from 'apify';
import { FileStoreInstance, FileStoreOptions } from '@usefelps/types';
export declare const create: (options: FileStoreOptions) => FileStoreInstance;
export declare const load: (fileStore: FileStoreInstance) => Promise<FileStoreInstance>;
export declare const get: (fileStore: FileStoreInstance, key: string) => Promise<Apify.KeyValueStoreValueTypes>;
export declare const set: <TValue extends object = any>(fileStore: FileStoreInstance, key: string, value: TValue, options?: {
    contentType?: string;
}) => Promise<void>;
declare const _default: {
    create: (options: FileStoreOptions) => FileStoreInstance;
    load: (fileStore: FileStoreInstance) => Promise<FileStoreInstance>;
    get: (fileStore: FileStoreInstance, key: string) => Promise<Apify.KeyValueStoreValueTypes>;
    set: <TValue extends object = any>(fileStore: FileStoreInstance, key: string, value: TValue, options?: {
        contentType?: string;
    }) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map