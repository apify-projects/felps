import { camelCase } from 'camel-case';
import { TrailDataRequestItemStatus } from './types';

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

// export const HOOK = {
//     STEP_STARTED: 'STEP_STARTED',
//     STEP_ENDED: 'STEP_ENDED',
//     STEP_FAILED: 'STEP_FAILED',
//     STEP_REQUEST_FAILED: 'STEP_REQUEST_FAILED',

//     ROUTER_STARTED: 'ROUTER_STARTED',
//     ROUTER_ENDED: 'ROUTER_ENDED',

//     QUEUE_STARTED: 'QUEUE_STARTED',
//     QUEUE_ENDED: 'QUEUE_ENDED',
// };

export const REFERENCE_KEY = (modelName: string): string => `${camelCase(modelName)}Key`;
export const MODEL_UID_KEY = (modelName: string): string => `mod_${camelCase(modelName)}`;
export const REQUEST_UID_KEY = `req`;

export const METADATA_KEY = 'FELPS_METADATA';
