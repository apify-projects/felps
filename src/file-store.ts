/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify from 'apify';
import { FileStoreOptions } from './common/types';
import Base from './base';

export default class FileStore extends Base {
    kv: Apify.KeyValueStore;
    initialized: boolean;

    constructor(options: FileStoreOptions) {
        const { name, key = 'file-store' } = options || {};
        super({ key, name });

        this.initialized = false;
    }

    async get(key: string): Promise<any> {
        return this.kv.getValue(key);
    }

    async set(key: string, value: Apify.KeyValueStoreValueTypes, options?: { contentType?: string; }) {
        return this.kv.setValue(key, value, options);
    }

    async init() {
        if (!this.initialized) {
            this.log.info('Initializing...');
            this.initialized = true;
            this.kv = await Apify.openKeyValueStore(this.name !== 'default' ? this.name : undefined);
        }
    }
}
