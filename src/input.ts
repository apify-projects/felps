import cloneDeep from 'lodash.clonedeep';
import { InputDefinition, InputInstance } from './types';

export const create = <I extends InputDefinition>({ INPUT }: { INPUT: I }): InputInstance<I['schema']> => {
    return {
        ...INPUT,
        data: undefined,
    };
};

export const define = <I extends InputDefinition>(input: I): I => {
    return input;
};

export const clone = <T>(input: T): T => {
    return cloneDeep(input);
};

export default { create, define, clone };
