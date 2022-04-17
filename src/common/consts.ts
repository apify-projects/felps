import { camelCase } from 'camel-case';

export const UID_KEY_PREFIX = 'uk';
export const UID_KEY_LENGTH = 2;

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

export const METADATA_KEY = 'FELPS_METADATA';
