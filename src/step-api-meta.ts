import requestMeta from './request-meta';
import base from './base';
import { StepApiMetaInstance } from './common/types';

export const create = (): StepApiMetaInstance => {
    return {
        ...base.create({ key: 'step-api-meta', name: 'step-api-meta' }),
        handler(crawlingContext) {
            const meta = requestMeta.create(crawlingContext);

            return {
                getUserData: () => meta.userData,
                getMetaData: () => meta.data,
                getRerence: () => meta.data.reference,
            };
        },
    };
};

export default { create };
