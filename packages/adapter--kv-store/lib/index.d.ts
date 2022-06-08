import { KVStoreAdapterInstance, KVStoreAdapterListResult, KVStoreAdapterOptions, ReallyAny } from '@usefelps/types';
export declare const create: <T = any>(options: KVStoreAdapterOptions) => KVStoreAdapterInstance<T>;
export declare const load: (adapter: KVStoreAdapterInstance) => Promise<{
    resource: any;
    init?: (...args: any[]) => any;
    get: (connectedKv: KVStoreAdapterInstance<any>, key: string) => Promise<any>;
    set: (connectedKv: KVStoreAdapterInstance<any>, key: string, value: any, options: any) => Promise<any>;
    list: (connectedKv: KVStoreAdapterInstance<any>, prefix?: string, options?: any) => Promise<KVStoreAdapterListResult>;
    uid?: string;
    key?: string;
    name: string;
    id: string;
}>;
export declare const get: <T = any>(adapter: KVStoreAdapterInstance<T>, key: string) => Promise<T>;
export declare const set: <T = any>(adapter: KVStoreAdapterInstance<T>, key: string, value: ReallyAny, options?: ReallyAny) => Promise<string>;
export declare const list: <T = any>(adapter: KVStoreAdapterInstance<T>, prefix?: string, options?: ReallyAny) => Promise<KVStoreAdapterListResult>;
declare const _default: {
    create: <T = any>(options: KVStoreAdapterOptions<any>) => KVStoreAdapterInstance<T>;
    load: (adapter: KVStoreAdapterInstance<any>) => Promise<{
        resource: any;
        init?: (...args: any[]) => any;
        get: (connectedKv: KVStoreAdapterInstance<any>, key: string) => Promise<any>;
        set: (connectedKv: KVStoreAdapterInstance<any>, key: string, value: any, options: any) => Promise<any>;
        list: (connectedKv: KVStoreAdapterInstance<any>, prefix?: string, options?: any) => Promise<KVStoreAdapterListResult>;
        uid?: string;
        key?: string;
        name: string;
        id: string;
    }>;
    get: <T_1 = any>(adapter: KVStoreAdapterInstance<T_1>, key: string) => Promise<T_1>;
    set: <T_2 = any>(adapter: KVStoreAdapterInstance<T_2>, key: string, value: any, options?: any) => Promise<string>;
    list: <T_3 = any>(adapter: KVStoreAdapterInstance<T_3>, prefix?: string, options?: any) => Promise<KVStoreAdapterListResult>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map