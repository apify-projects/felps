import * as utils from '@usefelps/utils';
import * as FT from '@usefelps/types';

export const create = <I extends FT.InputDefinition>({ INPUT }: { INPUT: I }): FT.InputInstance<I['schema']> => {
    return {
        ...INPUT,
        data: undefined,
    };
};

export const define = <I extends FT.InputDefinition>(input: I): I => {
    return input;
};

export const clone = <T>(input: T): T => {
    return utils.clone(input);
};

export default { create, define, clone };
