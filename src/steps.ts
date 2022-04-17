import { StepsInstance, StepsOptions } from './common/types';
import step from './step';

export const create = <
    Names extends Record<string, string> = Record<string, string>,
    Methods = unknown,
    CustomMethods extends Partial<Record<Extract<keyof Names, string>, unknown>> = Partial<Record<Extract<keyof Names, string>, unknown>>
    >(options?: StepsOptions): StepsInstance<Names, Methods, CustomMethods> => {
    const { names = [] } = options || {};
    return names.reduce((steps, name) => ({
        ...steps,
        [name]: step.create<Methods>({ name }),
    }), {} as StepsInstance<Names, Methods, CustomMethods>);
};

export default { create };
