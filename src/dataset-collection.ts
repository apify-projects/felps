import { DatasetInstance, DatasetCollectionInstance, DatasetCollectionOptions } from './types';
import dataset from './dataset';
import { Dataset } from '.';

export const DefaultDatasetCollection = {
    default: dataset.create({}),
};

export const create = <Names extends string[] = []>(options?: DatasetCollectionOptions<Names>): DatasetCollectionInstance<Names> => {
    const { names = [] } = options || {};

    return (names as Names).reduce((datasets, name) => ({
        ...datasets,
        [name]: dataset.create({ name }),
    }), DefaultDatasetCollection as unknown as DatasetCollectionInstance<Names>);
};

export const close = async <Names extends string[] = []>(datasets: DatasetCollectionInstance<Names>) => {
    await Promise.all(Object.values<DatasetInstance>(datasets).map((d) => Dataset.close(d)));
};

export default { create, close };
