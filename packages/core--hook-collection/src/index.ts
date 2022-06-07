import Step from '@usefelps/core--step';
import { FlowDefinition, HooksInstance, InputDefinition, ModelDefinition, StepInstance } from '@usefelps/types';

export const create = <
    M extends Record<string, ModelDefinition>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition
// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(_: { MODELS?: M, FLOWS?: F, STEPS: S, INPUT: I }): HooksInstance<M, F, S, I> => {
    return {
        // global hooks
        ACTOR_STARTED: Step.create({ name: 'ACTOR_STARTED' }),
        ACTOR_ENDED: Step.create({ name: 'ACTOR_ENDED' }),
        QUEUE_STARTED: Step.create({ name: 'QUEUE_STARTED' }),
        QUEUE_ENDED: Step.create({ name: 'QUEUE_ENDED' }),
        // local hooks
        FLOW_STARTED: Step.create({ name: 'FLOW_STARTED' }),
        FLOW_ENDED: Step.create({ name: 'FLOW_ENDED' }),
        PRE_NAVIGATION: Step.create({ name: 'PRE_NAVIGATION' }),
        STEP_STARTED: Step.create({ name: 'STEP_STARTED' }),
        STEP_ENDED: Step.create({ name: 'STEP_ENDED' }),
        STEP_FAILED: Step.create({ name: 'STEP_FAILED' }),
        STEP_REQUEST_FAILED: Step.create({ name: 'STEP_REQUEST_FAILED' }),
    } as HooksInstance<M, F, S, I>;
};

export const globalHookNames = ['ACTOR_STARTED', 'ACTOR_ENDED', 'QUEUE_STARTED', 'QUEUE_ENDED'];

export const clone = <T extends Record<string, StepInstance>>(hooks: T): T => {
    return Object.keys(hooks).reduce((acc, name) => ({ ...acc, [name]: Step.create(hooks[name]) }), {}) as T;
};

export default { create, globalHookNames, clone };
