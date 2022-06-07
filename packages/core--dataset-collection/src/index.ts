import { DatasetInstance, DatasetCollectionInstance, DatasetCollectionOptions } from './types';
import { Dataset } from '@usefelps/core--dataset';

export const DefaultDatasetCollection = {
    default: Dataset.create({}),
};

export const create = <Names extends string[] = []>(options?: DatasetCollectionOptions<Names>): DatasetCollectionInstance<Names> => {
    const { names = [] } = options || {};

    return (names as Names).reduce((datasets, name) => ({
        ...datasets,
        [name]: Dataset.create({ name }),
    }), DefaultDatasetCollection as unknown as DatasetCollectionInstance<Names>);
};

export const close = async <Names extends string[] = []>(datasets: DatasetCollectionInstance<Names>) => {
    await Promise.all(Object.values<DatasetInstance>(datasets).map((d) => Dataset.close(d)));
};

export default { create, close };
