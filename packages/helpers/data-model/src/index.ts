import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import InstanceBase from "@usefelps/instance-base";
import Logger from "@usefelps/logger";
import * as FT from '@usefelps/types';

export const PATH = Symbol('DataModelPath');

function createAjv() {
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    return ajv;
}

export const create = <S extends FT.JSONSchema>(options?: FT.DataModelOptions<S>): FT.DataModelInstance<S> => {
    const { name, schema = {} } = options || {};
    return {
        ...InstanceBase.create({ key: 'data-model', name: name as string }),
        schema: schema as S
    };
};

export const validate = (dataModel: FT.DataModelInstance, data: FT.ReallyAny = {}, options: FT.DataModelValidateOptions = {}) => {
    const { partial = false, logError = true, throwError = true } = options;
    const check = createAjv().compile({ ...dataModel?.schema as unknown as Record<string, FT.ReallyAny>, ...(partial ? { required: [] } : {}) });
    const valid = check(data);
    if (!valid) {
        if (logError) {
            Logger.error(Logger.create({ id: 'data-model' }), `Input ${dataModel.name} is invalid`, { data, errors: check.errors });
        };
        if (throwError) {
            throw new Error(`Input ${dataModel.name} is invalid`);
        };
    }
    return { valid, errors: check.errors };
};

// export const filter = (dataModel: FT.DataModelInstance, data: FT.ReallyAny = {}, currentPath: string[] = []) => {

//     const schema = dataModel?.schema;

//     Reflect.set(data, PATH, currentPath);

//     const reducer = (parent: FT.ReallyAny, value: FT.ReallyAny, key: string) => {
//         const parentSchema = get(schema, parent[PATH]);
//         if (Array.isArray(parent)) {
//             return parent
//                 .filter((item) => validate({ name: dataModel.name, schema: parentSchema }, item).valid)
//                 .map((item) => filter({ name: dataModel.name, schema: parentSchema }, item, [...parent[PATH], 0]));

//         } else if (typeof parent === 'object' && parent !== null) {
//             Reflect.set(parent, PATH, [...parent[PATH], key]);

//         }
//         return value;
//     };

//     return reduce(data, reducer);
// };

export default { create, validate };
