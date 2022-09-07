import { TrailDataRequestItemStatus } from '@usefelps/types';
import { camelCase } from 'camel-case';

export const UID_KEY_PREFIX = 'uk';
export const UID_KEY_LENGTH = 2;

export const REQUEST_STATUS: Record<TrailDataRequestItemStatus, TrailDataRequestItemStatus> = {
    CREATED: 'CREATED',
    DISCARDED: 'DISCARDED',
    QUEUED: 'QUEUED',
    STARTED: 'STARTED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
    TO_BE_RETRIED: 'TO_BE_RETRIED',
};

export const UNPREFIXED_NAME_BY_ACTOR = (name = '') => name.split(/:/g).reverse()[0];
export const PREFIXED_NAME_BY_ACTOR = (actorName: string, name: string) => `a:${actorName}:${UNPREFIXED_NAME_BY_ACTOR(name)}`;
export const IS_NAME_SUFFIXED_BY_ACTOR = (name: string) => name.startsWith('a:');

export const REFERENCE_KEY = (modelName: string): string => `${camelCase(modelName || '')}Key`;
export const MODEL_UID_KEY = (modelName: string): string => `mod_${camelCase(modelName || '')}`;
export const REQUEST_UID_KEY = `req`;

export const METADATA_KEY = '___felps';
export const METADATA_CRAWLER_MODE_PATH = `${METADATA_KEY}.crawlerMode`;
export const SCHEMA_MODEL_NAME_KEY = 'modelName';

export const REQUEST_ID_PROP = <const>'requestId';
export const TRAIL_ID_PROP = <const>'trailId';
export const FLOW_ID_PROP = <const>'flowId';
export const ACTOR_ID_PROP = <const>'actorId';

export const TRAIL_UID_PREFIX = 'trail';
