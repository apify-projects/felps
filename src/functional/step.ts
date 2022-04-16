import { curryN } from 'rambda';
import { StepInstance, StepOptions } from '../common/types';
import base from './base';

export const create = <Methods = unknown>(options?: StepOptions<Methods>): StepInstance<Methods> => {
    const {
        name,
        handler = async () => undefined,
        errorHandler = async () => undefined,
        requestErrorHandler = async () => undefined,
    } = options || {};

    return {
        ...base.create({ key: 'step', name }),
        handler,
        errorHandler,
        requestErrorHandler,
    };
};

export const on = curryN(2, (step: StepInstance, handler: () => void) => {
    return {
        ...step,
        handler,
    };
});

export const extend = curryN(2, <Methods = unknown>(step: StepInstance, options: StepOptions<Methods>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...otherOptions } = options || {};
    return {
        ...step,
        ...otherOptions,
    };
});

export default { create, on, extend };
