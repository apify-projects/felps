import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Base, Logger } from '.';
import { reallyAny, ValidatorInstance, ValidatorOptions, ValidatorValidateOptions } from './types';

function createAjv() {
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    return ajv;
}

export const create = (options?: ValidatorOptions) => {
    const { name, schema = {} } = options || {};
    return {
        ...Base.create({ key: 'validator', name: name as string }),
        schema,
    };
};

export const validate = (validator: ValidatorInstance, data: reallyAny = {}, options: ValidatorValidateOptions = {}) => {
    const { partial = false, logError = true, throwError = true } = options;
    const check = createAjv().compile({ ...validator?.schema as unknown as Record<string, reallyAny>, ...(partial ? { required: [] } : {}) });
    const valid = check(data);
    if (!valid) {
        if (logError) {
            Logger.error(Logger.create({ id: 'validator' }), `Input ${validator.name} is invalid`, { data, errors: check.errors });
        };
        if (throwError) {
            throw new Error(`Input ${validator.name} is invalid`);
        };
    }
    return valid;
};

export default { create, validate };
