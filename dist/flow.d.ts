import { FlowInstance, FlowOptions } from './types';
export declare const create: <StepNames = string>(options: FlowOptions<StepNames>) => FlowInstance<StepNames>;
export declare const has: <StepNames = unknown>(flow: FlowInstance<StepNames>, stepName: StepNames) => boolean;
declare const _default: {
    create: <StepNames = string>(options: FlowOptions<StepNames>) => FlowInstance<StepNames>;
    has: <StepNames_1 = unknown>(flow: FlowInstance<StepNames_1>, stepName: StepNames_1) => boolean;
};
export default _default;
//# sourceMappingURL=flow.d.ts.map