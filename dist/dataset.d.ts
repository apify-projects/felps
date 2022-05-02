import { DatasetInstance, DatasetOptions, ReallyAny } from './types';
export declare const create: (options: DatasetOptions) => DatasetInstance;
export declare const load: (dataset: DatasetInstance) => Promise<DatasetInstance>;
export declare const push: (dataset: DatasetInstance, data: ReallyAny | ReallyAny[]) => Promise<void | undefined>;
declare const _default: {
    create: (options: DatasetOptions) => DatasetInstance;
    load: (dataset: DatasetInstance) => Promise<DatasetInstance>;
    push: (dataset: DatasetInstance, data: any) => Promise<void | undefined>;
};
export default _default;
//# sourceMappingURL=dataset.d.ts.map