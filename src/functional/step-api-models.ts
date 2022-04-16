import base from './base';

// eslint-disable-next-line max-len
export const create = (options) > => {
    const { } = options || {};

    return {
        ...base.create({ key: 'step-api-models', name: 'step-api-models' }),
        handler(crawlingContext) {

        }
    };
};

