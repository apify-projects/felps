"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRAIL_UID_PREFIX = exports.ACTOR_KEY_PROP = exports.FLOW_KEY_PROP = exports.TRAIL_KEY_PROP = exports.REQUEST_KEY_PROP = exports.SCHEMA_MODEL_NAME_KEY = exports.METADATA_KEY = exports.REQUEST_UID_KEY = exports.MODEL_UID_KEY = exports.REFERENCE_KEY = exports.IS_NAME_SUFFIXED_BY_ACTOR = exports.PREFIXED_NAME_BY_ACTOR = exports.UNPREFIXED_NAME_BY_ACTOR = exports.MODEL_STATUS = exports.REQUEST_STATUS = exports.UID_KEY_LENGTH = exports.UID_KEY_PREFIX = void 0;
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
const UNPREFIXED_NAME_BY_ACTOR = (name) => name.split(/:/g).reverse()[0];
exports.UNPREFIXED_NAME_BY_ACTOR = UNPREFIXED_NAME_BY_ACTOR;
const PREFIXED_NAME_BY_ACTOR = (actorName, name) => `a:${actorName}:${(0, exports.UNPREFIXED_NAME_BY_ACTOR)(name)}`;
exports.PREFIXED_NAME_BY_ACTOR = PREFIXED_NAME_BY_ACTOR;
const IS_NAME_SUFFIXED_BY_ACTOR = (name) => name.startsWith('a:');
exports.IS_NAME_SUFFIXED_BY_ACTOR = IS_NAME_SUFFIXED_BY_ACTOR;
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
exports.ACTOR_KEY_PROP = 'fActorKey';
exports.TRAIL_UID_PREFIX = 'trail';
//# sourceMappingURL=consts.js.map