import { InputDefinition, InputInstance } from './types';
export declare const create: <I extends InputDefinition<{
    type: "object";
}>>({ INPUT }: {
    INPUT: I;
}) => InputInstance<I["schema"]>;
export declare const define: <I extends InputDefinition<{
    type: "object";
}>>(input: I) => I;
export declare const clone: <T>(input: T) => T;
declare const _default: {
    create: <I extends InputDefinition<{
        type: "object";
    }>>({ INPUT }: {
        INPUT: I;
    }) => InputInstance<I["schema"]>;
    define: <I_1 extends InputDefinition<{
        type: "object";
    }>>(input: I_1) => I_1;
    clone: <T>(input: T) => T;
};
export default _default;
//# sourceMappingURL=input.d.ts.map