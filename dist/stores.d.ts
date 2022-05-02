import { DataStoreInstance, DefaultDataStoreNames, DefaultFileStoreNames, FileStoreInstance, GenerateObject, StoresInstance, StoresOptions } from './types';
export declare const DefaultDataStores: GenerateObject<DefaultDataStoreNames, DataStoreInstance>;
export declare const DefautFileStores: GenerateObject<DefaultFileStoreNames, FileStoreInstance>;
export declare const create: <DataStoreNames extends string[] = [], FileStoreNames extends string[] = []>(options?: StoresOptions<DataStoreNames, FileStoreNames> | undefined) => StoresInstance<DataStoreNames, FileStoreNames>;
export declare const load: (stores: StoresInstance) => Promise<StoresInstance>;
export declare const persist: (stores: StoresInstance) => Promise<void>;
export declare const listen: (stores: StoresInstance) => void;
declare const _default: {
    create: <DataStoreNames extends string[] = [], FileStoreNames extends string[] = []>(options?: StoresOptions<DataStoreNames, FileStoreNames> | undefined) => StoresInstance<DataStoreNames, FileStoreNames>;
    load: (stores: StoresInstance<[], []>) => Promise<StoresInstance<[], []>>;
    persist: (stores: StoresInstance<[], []>) => Promise<void>;
    listen: (stores: StoresInstance<[], []>) => void;
    DefaultDataStores: GenerateObject<DefaultDataStoreNames, DataStoreInstance>;
    DefautFileStores: GenerateObject<DefaultFileStoreNames, FileStoreInstance>;
};
export default _default;
//# sourceMappingURL=stores.d.ts.map