import base from './base';

// eslint-disable-next-line max-len
export const create = () => {
    // const { } = options || {};

    return {
        ...base.create({ key: 'step-api-flows', name: 'step-api-flows' }),
        // handler(crawlingContext) {

        // }
    };
};

export default { create };
