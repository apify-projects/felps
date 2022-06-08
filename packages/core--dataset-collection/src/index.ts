import Dataset from '@usefelps/core--dataset';
import * as FT from '@usefelps/types';

export const DefaultDatasetCollection = {
    default: Dataset.create({}),
};

export const create = <Names extends string[] = []>(options?: FT.DatasetCollectionOptions<Names>): FT.DatasetCollectionInstance<Names> => {
    const { names = [] } = options || {};

    return (names as Names).reduce((datasets, name) => ({
        ...datasets,
        [name]: Dataset.create({ name }),
    }), DefaultDatasetCollection as unknown as FT.DatasetCollectionInstance<Names>);
};

export const close = async <Names extends string[] = []>(datasets: FT.DatasetCollectionInstance<Names>) => {
    await Promise.all(Object.values<FT.DatasetInstance>(datasets).map((d) => Dataset.close(d)));
};

export default { create, close };
