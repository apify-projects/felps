import type { HooksInstance } from './common/types';
import step from './step';

export const create = <Methods = unknown>(): HooksInstance<Methods> => {
    return {
        STEP_STARTED: step.create<Methods>({ name: 'STEP_STARTED' }),
        STEP_ENDED: step.create<Methods>({ name: 'STEP_ENDED' }),
        STEP_FAILED: step.create<Methods>({ name: 'STEP_FAILED' }),
        STEP_REQUEST_FAILED: step.create<Methods>({ name: 'STEP_REQUEST_FAILED' }),
        ACTOR_STARTED: step.create<Methods>({ name: 'ACTOR_STARTED' }),
        ACTOR_ENDED: step.create<Methods>({ name: 'ACTOR_ENDED' }),
        QUEUE_STARTED: step.create<Methods>({ name: 'QUEUE_STARTED' }),
        QUEUE_ENDED: step.create<Methods>({ name: 'QUEUE_ENDED' }),
    };
};

export default { create };
