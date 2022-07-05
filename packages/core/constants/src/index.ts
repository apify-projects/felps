import { camelCase } from 'camel-case';

export const UID_KEY_PREFIX = 'uk';
export const UID_KEY_LENGTH = 2;

export const REQUEST_STATUS = {
    CREATED: 'CREATED',
    DISCARDED: 'DISCARDED',
    QUEUED: 'QUEUED',
    STARTED: 'STARTED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
};

export const UNPREFIXED_NAME_BY_ACTOR = (name = '') => name.split(/:/g).reverse()[0];
export const PREFIXED_NAME_BY_ACTOR = (actorName: string, name: string) => `a:${actorName}:${UNPREFIXED_NAME_BY_ACTOR(name)}`;
export const IS_NAME_SUFFIXED_BY_ACTOR = (name: string) => name.startsWith('a:');

export const REFERENCE_KEY = (modelName: string): string => `${camelCase(modelName || '')}Key`;
export const MODEL_UID_KEY = (modelName: string): string => `mod_${camelCase(modelName || '')}`;
export const REQUEST_UID_KEY = `req`;

export const METADATA_KEY = '___felps';
export const SCHEMA_MODEL_NAME_KEY = 'modelName';

export const REQUEST_KEY_PROP = <const>'requestKey';
export const TRAIL_KEY_PROP = <const>'trailKey';
export const FLOW_KEY_PROP = <const>'flowKey';
export const ACTOR_KEY_PROP = <const>'actorKey';

export const TRAIL_UID_PREFIX = 'trail';
