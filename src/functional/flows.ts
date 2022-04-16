import { FlowsInstance, FlowsOptions } from '../common/types';
import flow from './flow';

export const create = <Names extends string[] = []>(options?: FlowsOptions<Names>): FlowsInstance<Names> => {
    const { names = [] } = options || {};
    return names.reduce((steps, name) => ({
        ...steps,
        [name]: flow.create({ name }),
    }), {} as FlowsInstance<Names>);
};

export default { create };
