import requestMeta from './request-meta';
import base from './base';
import { StepApiMetaInstance } from './types';

export const create = (): StepApiMetaInstance => {
    return {
        ...base.create({ key: 'step-api-meta', name: 'step-api-meta' }),
        handler(RequestContext) {
            const meta = requestMeta.create(RequestContext);

            return {
                getUserData: () => meta.userData,
                getMetaData: () => meta.data,
                getRerence: () => meta.data.reference,
            };
        },
    };
};

export default { create };
