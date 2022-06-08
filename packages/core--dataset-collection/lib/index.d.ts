import * as FT from '@usefelps/types';
export declare const DefaultDatasetCollection: {
    default: FT.DatasetInstance;
};
export declare const create: <Names extends string[] = []>(options?: FT.DatasetCollectionOptions<Names>) => FT.DatasetCollectionInstance<Names>;
export declare const close: <Names extends string[] = []>(datasets: FT.DatasetCollectionInstance<Names>) => Promise<void>;
declare const _default: {
    create: <Names extends string[] = []>(options?: FT.DatasetCollectionOptions<Names>) => FT.DatasetCollectionInstance<Names>;
    close: <Names_1 extends string[] = []>(datasets: FT.DatasetCollectionInstance<Names_1>) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map