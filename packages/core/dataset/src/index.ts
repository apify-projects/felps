/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dataset } from '@crawlee/core';
import InstanceBase from '@usefelps/instance-base';
import Hook from '@usefelps/hook';
import { DatasetInstance, DatasetOptions, ReallyAny } from '@usefelps/types';
import { pathify } from '@usefelps/utils';

export const create = (options: DatasetOptions): DatasetInstance => {
    const { name, hooks } = options || {};

    const base = InstanceBase.create({ key: 'dataset', name });

    return {
        ...base,
        resource: undefined,
        ...options,
        hooks: {
            preDataPushedHook: Hook.create({
                ...hooks?.preDataPushedHook,
                name: pathify(base.name, 'preDataPushedHook'),
            }),
            postDataPushFailedHook: Hook.create({
                name: pathify(base.name, 'postDataPushFailedHook'),
                handlers: [
                    ...(hooks?.postDataPushFailedHook?.handlers || []),
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
            Hook.run(loaded.hooks.postDataPushFailedHook, dataset, data, error);

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
