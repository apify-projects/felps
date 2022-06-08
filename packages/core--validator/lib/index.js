"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.create = void 0;
const tslib_1 = require("tslib");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const ajv_formats_1 = tslib_1.__importDefault(require("ajv-formats"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const helper__logger_1 = tslib_1.__importDefault(require("@usefelps/helper--logger"));
function createAjv() {
    const ajv = new ajv_1.default({ allErrors: true });
    ajv.addKeyword('modelName');
    ajv.addKeyword('resolveList');
    ajv.addKeyword('organizeList');
    ajv.addKeyword('isListComplete');
    ajv.addKeyword('isItemMatch');
    (0, ajv_formats_1.default)(ajv);
    return ajv;
}
const create = (options) => {
    const { name, schema = {} } = options || {};
    return {
        ...core__instance_base_1.default.create({ key: 'validator', name: name }),
        schema,
    };
};
exports.create = create;
const validate = (validator, data = {}, options = {}) => {
    const { partial = false, logError = true, throwError = true } = options;
    const check = createAjv().compile({ ...validator?.schema, ...(partial ? { required: [] } : {}) });
    const valid = check(data);
    if (!valid) {
        if (logError) {
            helper__logger_1.default.error(helper__logger_1.default.create({ id: 'validator' }), `Input ${validator.name} is invalid`, { data, errors: check.errors });
        }
        ;
        if (throwError) {
            throw new Error(`Input ${validator.name} is invalid`);
        }
        ;
    }
    return { valid, errors: check.errors };
};
exports.validate = validate;
exports.default = { create: exports.create, validate: exports.validate };
//# sourceMappingURL=index.js.map