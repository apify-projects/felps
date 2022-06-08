import * as FT from '@usefelps/types';
export declare const create: <I extends FT.InputDefinition<{
    type: "object";
}>>({ INPUT }: {
    INPUT: I;
}) => FT.InputInstance<I["schema"]>;
export declare const define: <I extends FT.InputDefinition<{
    type: "object";
}>>(input: I) => I;
export declare const clone: <T>(input: T) => T;
declare const _default: {
    create: <I extends FT.InputDefinition<{
        type: "object";
    }>>({ INPUT }: {
        INPUT: I;
    }) => FT.InputInstance<I["schema"]>;
    define: <I_1 extends FT.InputDefinition<{
        type: "object";
    }>>(input: I_1) => I_1;
    clone: <T>(input: T) => T;
};
export default _default;
//# sourceMappingURL=index.d.ts.map