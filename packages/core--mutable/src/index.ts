export const extend = <I>(...instances: I[]) => {
    return {
        with: (options: Partial<I>): I[] => {
            return instances.map((i) => Object.assign(i, options)) as I[];
        },
    };
};

export default { extend };
