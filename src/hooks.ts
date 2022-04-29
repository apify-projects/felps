import type { HooksInstance, InputDefinition, ModelDefinition } from './types';
import step from './step';

export const create = <
    M extends Record<string, ModelDefinition>, F, S, I extends InputDefinition
// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(_: { MODELS?: M, FLOWS?: F, STEPS: S, INPUT: I }): HooksInstance<M, F, S, I> => {
    return {
        STEP_STARTED: step.create({ name: 'STEP_STARTED' }),
        STEP_ENDED: step.create({ name: 'STEP_ENDED' }),
        STEP_FAILED: step.create({ name: 'STEP_FAILED' }),
        STEP_REQUEST_FAILED: step.create({ name: 'STEP_REQUEST_FAILED' }),
        ACTOR_STARTED: step.create({ name: 'ACTOR_STARTED' }),
        ACTOR_ENDED: step.create({ name: 'ACTOR_ENDED' }),
        QUEUE_STARTED: step.create({ name: 'QUEUE_STARTED' }),
        QUEUE_ENDED: step.create({ name: 'QUEUE_ENDED' }),
    } as HooksInstance<M, F, S, I>;
};

export default { create };
