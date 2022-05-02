"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FLOW_KEY_PROP = exports.TRAIL_KEY_PROP = exports.REQUEST_KEY_PROP = exports.SCHEMA_MODEL_NAME_KEY = exports.METADATA_KEY = exports.REQUEST_UID_KEY = exports.MODEL_UID_KEY = exports.REFERENCE_KEY = exports.MODEL_STATUS = exports.REQUEST_STATUS = exports.UID_KEY_LENGTH = exports.UID_KEY_PREFIX = void 0;
const camel_case_1 = require("camel-case");
exports.UID_KEY_PREFIX = 'uk';
exports.UID_KEY_LENGTH = 2;
exports.REQUEST_STATUS = {
    CREATED: 'CREATED',
    DISCARDED: 'DISCARDED',
    QUEUED: 'QUEUED',
    STARTED: 'STARTED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
};
exports.MODEL_STATUS = {
    CREATED: 'CREATED',
    PUSHED: 'PUSHED',
    DISCARDED: 'DISCARDED',
};
const REFERENCE_KEY = (modelName) => `${(0, camel_case_1.camelCase)(modelName || '')}Key`;
exports.REFERENCE_KEY = REFERENCE_KEY;
const MODEL_UID_KEY = (modelName) => `mod_${(0, camel_case_1.camelCase)(modelName || '')}`;
exports.MODEL_UID_KEY = MODEL_UID_KEY;
exports.REQUEST_UID_KEY = `req`;
exports.METADATA_KEY = '___felps';
exports.SCHEMA_MODEL_NAME_KEY = 'modelName';
exports.REQUEST_KEY_PROP = 'fRequestKey';
exports.TRAIL_KEY_PROP = 'fTrailKey';
exports.FLOW_KEY_PROP = 'fFlowKey';
//# sourceMappingURL=consts.js.map