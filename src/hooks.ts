import type { HooksInstance } from './common/types';
import step from './step';

export const create = (): HooksInstance => {
    return {
        stepStarted: step.create({ name: 'stepStarted' }),
        stepEnded: step.create({ name: 'stepEnded' }),
        stepFailed: step.create({ name: 'stepFailed' }),
        stepRequestFailed: step.create({ name: 'stepRequestFailed' }),
        actorStarted: step.create({ name: 'actorStarted' }),
        actorEnded: step.create({ name: 'actorEnded' }),
        queueStarted: step.create({ name: 'queueStarted' }),
        queueEnded: step.create({ name: 'queueEnded' }),
    };
};

export default { create };
