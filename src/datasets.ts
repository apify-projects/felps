import { DatasetsInstance, DatasetsOptions } from './types';
import dataset from './dataset';

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

export default { create };
