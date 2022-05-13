import { DatasetInstance, DatasetsInstance, DatasetsOptions } from './types';
import dataset from './dataset';
import { Dataset } from '.';

export const DefaultDatasets = {
    default: dataset.create({}),
};

export const create = <Names extends string[] = []>(options?: DatasetsOptions<Names>): DatasetsInstance<Names> => {
    const { names = [] } = options || {};

    return (names as Names).reduce((datasets, name) => ({
        ...datasets,
        [name]: dataset.create({ name }),
    }), DefaultDatasets as unknown as DatasetsInstance<Names>);
};

export const close = async <Names extends string[] = []>(datasets: DatasetsInstance<Names>) => {
    await Promise.all(Object.values<DatasetInstance>(datasets).map((d) => Dataset.close(d)));
};

export default { create, close };
