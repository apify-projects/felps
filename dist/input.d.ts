import { InputDefinition, InputInstance } from './types';
export declare const create: <I extends InputDefinition<{
    type: "object";
}>>({ INPUT }: {
    INPUT: I;
}) => InputInstance<I["schema"]>;
export declare const define: <I extends InputDefinition<{
    type: "object";
}>>(input: I) => I;
declare const _default: {
    create: <I extends InputDefinition<{
        type: "object";
    }>>({ INPUT }: {
        INPUT: I;
    }) => InputInstance<I["schema"]>;
    define: <I_1 extends InputDefinition<{
        type: "object";
    }>>(input: I_1) => I_1;
};
export default _default;
//# sourceMappingURL=input.d.ts.map