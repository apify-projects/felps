import { DeepPartial, TrailOptions, TrailState } from './common/types';
import { craftUIDKey } from './common/utils';
import DataStore from './data-store';

export default class Trail extends DataStore {
    constructor(options: TrailOptions) {
        const { id = craftUIDKey('trail') } = options || {};

        super({
            key: 'store-trail',
            name: id,
            kvKey: 'store-trails',
            pathPrefix: `${id}`,
        });

        if (!this.has('')) {
            const initialState: DeepPartial<TrailState> = {
                id,
                query: {},
                requests: {},
                stats: { startedAt: new Date().toISOString() },
            };

            this.set('', initialState);
        }
    }
}
