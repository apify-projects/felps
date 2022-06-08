import { DatasetInstance, DatasetOptions, ReallyAny } from '@usefelps/types';
export declare const create: (options: DatasetOptions) => DatasetInstance;
export declare const load: (dataset: DatasetInstance) => Promise<DatasetInstance>;
export declare const push: (dataset: DatasetInstance, data: ReallyAny | ReallyAny[]) => Promise<void>;
export declare const close: (dataset: DatasetInstance) => Promise<void>;
declare const _default: {
    create: (options: DatasetOptions) => DatasetInstance;
    load: (dataset: DatasetInstance) => Promise<DatasetInstance>;
    push: (dataset: DatasetInstance, data: any) => Promise<void>;
    close: (dataset: DatasetInstance) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map