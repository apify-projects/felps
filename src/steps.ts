import { StepsInstance, StepsOptions } from './common/types';
import step from './step';

export const create = <
    Names extends Record<string, string> = Record<string, string>,
    Methods = unknown>(options?: StepsOptions): StepsInstance<Names, Methods> => {
    const { names = [] } = options || {};
    return names.reduce((steps, name) => ({
        ...steps,
        [name]: step.create<Methods>({ name }),
    }), {} as StepsInstance<Names, Methods>);
};

export default { create };
