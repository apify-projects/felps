/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify from 'apify';
import Events from './events';
import base from './base';
import { DatasetInstance, DatasetOptions, ReallyAny } from './types';

export const create = (options: DatasetOptions): DatasetInstance => {
    const { name } = options || {};

    return {
        ...base.create({ key: 'dataset', name: name as string }),
        resource: undefined,
        events: Events.create({ name: name as string }),
    };
};

export const load = async (dataset: DatasetInstance): Promise<DatasetInstance> => {
    if (dataset.resource) return dataset;

    return {
        ...dataset,
        resource: await Apify.openDataset(dataset.name),
    };
};

export const push = async (dataset: DatasetInstance, data: ReallyAny | ReallyAny[]) => {
    const loaded = await load(dataset);
    if (loaded.resource) {
        Events.emit(dataset.events, 'push', data);
        return loaded.resource.pushData(data);
    }
};

export const close = async (dataset: DatasetInstance) => {
    await Events.close(dataset.events);
};

export default { create, load, push, close };
