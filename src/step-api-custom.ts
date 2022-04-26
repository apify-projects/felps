import base from './base';

// eslint-disable-next-line max-len
export const create = () => {
    // const { } = options || {};

    return {
        ...base.create({ key: 'step-api-custom', name: 'step-api-custom' }),
        // handler(RequestContext) {

        // }
    };
};

export default { create };
