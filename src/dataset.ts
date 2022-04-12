/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify from 'apify';
import Base from './base';
import { DatasetOptions } from './common/types';

export default class Dataset extends Base {
    dataset: Apify.Dataset;

    constructor(options?: DatasetOptions) {
        const { name = 'default' } = options || {};
        super({ key: 'dataset', name });
        this.dataset = undefined;
    }

    async init() {
        if (!this.dataset) {
            this.dataset = await Apify.openDataset(this.name !== 'default' ? this.name : undefined);
        }
    }

    async push(data: any | any[]) {
        return this.dataset.pushData(data);
    }
}
