/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dataset } from '@crawlee/core';
import Events from '@usefelps/core--events';
import base from '@usefelps/core--instance-base';
import { DatasetInstance, DatasetOptions, ReallyAny } from '@usefelps/types';

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
        resource: await Dataset.open(dataset.name !== 'default' ? dataset.name : undefined),
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
