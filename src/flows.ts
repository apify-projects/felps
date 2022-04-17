import { FlowsInstance, FlowsOptions } from './common/types';
import flow from './flow';

export const create = <Names extends Record<string, string> = Record<string, string>>(options?: FlowsOptions): FlowsInstance<Names> => {
    const { names = [] } = options || {};
    return names.reduce((steps, name) => ({
        ...steps,
        [name]: flow.create({ name }),
    }), {} as FlowsInstance<Names>);
};

export default { create };
