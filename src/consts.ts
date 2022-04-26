import { camelCase } from 'camel-case';
import { TrailDataRequestItemStatus, TrailDataModelItemStatus } from './types';

export const UID_KEY_PREFIX = 'uk';
export const UID_KEY_LENGTH = 2;

export const REQUEST_STATUS: Record<TrailDataRequestItemStatus, TrailDataRequestItemStatus> = {
    CREATED: 'CREATED',
    DISCARDED: 'DISCARDED',
    QUEUED: 'QUEUED',
    STARTED: 'STARTED',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
};

export const MODEL_STATUS: Record<TrailDataModelItemStatus, TrailDataModelItemStatus> = {
    CREATED: 'CREATED',
    PUSHED: 'PUSHED',
    DISCARDED: 'DISCARDED',
};

export const REFERENCE_KEY = (modelName: string): string => `${camelCase(modelName)}Key`;
export const MODEL_UID_KEY = (modelName: string): string => `mod_${camelCase(modelName)}`;
export const REQUEST_UID_KEY = `req`;

export const METADATA_KEY = 'FELPS_METADATA';
export const SCHEMA_MODEL_NAME_KEY = 'modelName';

export const REQUEST_KEY_PROP = 'requestKey';
export const TRAIL_KEY_PROP = 'trailKey';
