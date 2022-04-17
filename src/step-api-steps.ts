import base from './base';

// eslint-disable-next-line max-len
export const create = () => {
    // const { } = options || {};

    return {
        ...base.create({ key: 'step-api-steps', name: 'step-api-steps' }),
        // handler(crawlingContext) {

        // }
    };
};

export default { create };
