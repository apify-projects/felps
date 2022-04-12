import { BaseOptions } from './common/types';
import Logger from './logger';

export default class Base {
    uid!: string;
    key: string;
    name: string;
    id!: string;

    log: Logger;

    constructor(options: BaseOptions) {
        const {
            key = 'step',
            name,
        } = options;

        this.key = key;
        this.name = name;
        // this.uid = craftUIDKey(this.key);
        this.id = `${this.uid}-${this.name || 'default'}`;

        this.log = new Logger(this);
    }
}
