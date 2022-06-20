/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dataset } from '@crawlee/core';
import BaseInstance from '@usefelps/core--instance-base';
import Hook from '@usefelps/core--hook';
import { DatasetInstance, DatasetOptions, ReallyAny } from '@usefelps/types';
import { pathify } from '@usefelps/helper--utils';

export const create = (options: DatasetOptions): DatasetInstance => {
    const { name, hooks } = options || {};

    const base = BaseInstance.create({ key: 'dataset', name });

    return {
        ...base,
        resource: undefined,
        hooks: {
            preDataPushedHook: Hook.create({
                name: pathify(base.name, 'preDataPushedHook'),
                handlers: [
                    ...(hooks?.preDataPushedHook?.handlers || []),
                ],
            }),
            onDataPushFailedHook: Hook.create({
                name: pathify(base.name, 'onDataPushFailedHook'),
                handlers: [
                    ...(hooks?.onDataPushFailedHook?.handlers || []),
                ],
            }),
            postDataPushedHook: Hook.create({
                name: pathify(base.name, 'postDataPushedHook'),
                handlers: [
                    ...(hooks?.postDataPushedHook?.handlers || []),
                ],
            }),
        }
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

        /**
         * Run any logic before data is pushed to the dataset
         * Ex: Logging, etc.
         * By default: (does nothing for now)
         */
        Hook.run(loaded.hooks.preDataPushedHook, dataset, data);

        try {
            await loaded.resource.pushData(data);

        } catch (error) {
            /**
             * Run any logic after data is successfully pushed to the dataset
             * Ex: Logging, etc.
             * By default: (does nothing for now)
             */
             Hook.run(loaded.hooks.onDataPushFailedHook, dataset, data, error);

        } finally {
            /**
             * Run any logic after data is successfully pushed to the dataset
             * Ex: Logging, etc.
             * By default: (does nothing for now)
             */
            Hook.run(loaded.hooks.postDataPushedHook, dataset, data);
        }
    }
};

export default { create, load, push };
