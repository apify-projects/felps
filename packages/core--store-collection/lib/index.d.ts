import { StoreCollectionInstance, StoreCollectionOptions } from '@usefelps/types';
export declare const DefaultDataStores: ({
    name: string;
    kvKey: string;
    splitByKey?: undefined;
} | {
    name: string;
    kvKey: string;
    splitByKey: boolean;
})[];
export declare const DefautFileStores: {
    name: string;
    kvKey: string;
}[];
export declare const create: (options?: StoreCollectionOptions) => StoreCollectionInstance;
export declare const load: (stores: StoreCollectionInstance) => Promise<StoreCollectionInstance>;
export declare const persist: (stores: StoreCollectionInstance) => Promise<void>;
export declare const listen: (stores: StoreCollectionInstance) => void;
declare const _default: {
    create: (options?: StoreCollectionOptions) => StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>;
    load: (stores: StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>) => Promise<StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>>;
    persist: (stores: StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>) => Promise<void>;
    listen: (stores: StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>) => void;
    DefaultDataStores: ({
        name: string;
        kvKey: string;
        splitByKey?: undefined;
    } | {
        name: string;
        kvKey: string;
        splitByKey: boolean;
    })[];
    DefautFileStores: {
        name: string;
        kvKey: string;
    }[];
};
export default _default;
//# sourceMappingURL=index.d.ts.map