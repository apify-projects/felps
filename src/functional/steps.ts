import { StepsInstance, StepsOptions } from '../common/types';
import step from './step';

export const create = <Names extends string[] = []>(options?: StepsOptions<Names>): StepsInstance<Names> => {
    const { names = [] } = options || {};
    return names.reduce((steps, name) => ({
        ...steps,
        [name]: step.create({ name }),
    }), {} as StepsInstance<Names>);
};

export default { create };
