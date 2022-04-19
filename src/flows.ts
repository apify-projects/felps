import { FlowNamesSignature, FlowsInstance, FlowsOptions } from './common/types';
import flow from './flow';

export const create = <
    FlowNames extends FlowNamesSignature = FlowNamesSignature
>(options?: FlowsOptions): FlowsInstance<FlowNames> => {
    const { names = [] } = options || {};
    return names.reduce((steps, name) => ({
        ...steps,
        [name]: flow.create({ name }),
    }), {} as FlowsInstance<FlowNames>);
};

export default { create };

//     Definitions extends Record<keyof FlowNames, string[]> = Record<keyof FlowNames, string[]>
