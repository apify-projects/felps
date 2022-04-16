/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify from 'apify';
import { curryN } from 'rambda';
import { DatasetInstance, DatasetOptions } from '../common/types';
import base from './base';

export const create = (options?: DatasetOptions): DatasetInstance => {
    const { name } = options || {};

    return {
        ...base.create({ key: 'dataset', name }),
        resource: undefined,
    };
};

export const load = async (dataset: DatasetInstance): Promise<DatasetInstance> => {
    if (dataset.resource) return dataset;

    return {
        ...dataset,
        resource: await Apify.openDataset(dataset.name),
    };
};

export const push = curryN(2, async (dataset: DatasetInstance, data: any | any[]) => {
    const loaded = await load(dataset);
    return loaded.resource.pushData(data);
});

export default { create, load, push };
