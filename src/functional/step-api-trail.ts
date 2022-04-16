import base from './base';

export const create = () => {
    return {
        ...base.create({ key: 'step-api-trail', name: 'step-api-trail' }),
        handler(crawlingContext) {

            return {
                trail: {}
            };
        },
    };
};

export default { create };
