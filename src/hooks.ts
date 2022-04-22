import type { HooksInstance, ModelDefinition } from './common/types';
import step from './step';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const create = <M extends Record<string, ModelDefinition>, F, S>(_: { MODELS?: M, FLOWS?: F, STEPS: S }): HooksInstance<M, F, S> => {
    return {
        STEP_STARTED: step.create({ name: 'STEP_STARTED' }),
        STEP_ENDED: step.create({ name: 'STEP_ENDED' }),
        STEP_FAILED: step.create({ name: 'STEP_FAILED' }),
        STEP_REQUEST_FAILED: step.create({ name: 'STEP_REQUEST_FAILED' }),
        ACTOR_STARTED: step.create({ name: 'ACTOR_STARTED' }),
        ACTOR_ENDED: step.create({ name: 'ACTOR_ENDED' }),
        QUEUE_STARTED: step.create({ name: 'QUEUE_STARTED' }),
        QUEUE_ENDED: step.create({ name: 'QUEUE_ENDED' }),
    } as HooksInstance<M, F, S>;
};

export default { create };
