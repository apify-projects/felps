import BaseInstance from '@usefelps/core--instance-base';
import { deduplicateFunctions } from '@usefelps/helper--utils';
import * as FT from '@usefelps/types';

export const create = <HookParametersSignature extends FT.HookParametersSignatureDefault = FT.HookParametersSignatureDefault>(options: FT.HookOptions<HookParametersSignature>): FT.HookInstance<HookParametersSignature> => {
    return {
        ...BaseInstance.create({ key: 'hook', name: options?.name || 'default' }),
        handlers: options.handlers.filter(Boolean),
        validationHandler: options?.validationHandler || async function () { return true },
        errorHook: 'errorHook' in options ? create({ ...(options.errorHook || {}), name: 'errorHook' }) : undefined,
    };
};

export const run = async <HookParametersSignature extends FT.HookParametersSignatureDefault = FT.HookParametersSignatureDefault>(hook: FT.HookInstance<HookParametersSignature>, ...args: HookParametersSignature): Promise<void> => {
    try {
        const valid = await hook.validationHandler(...(args as FT.ReallyAny));
        if (!valid) return;
    } catch (error) {
        return;
    }

    for (const handler of deduplicateFunctions(hook.handlers)) {
        try {
            await Promise.resolve(handler(...(args as FT.ReallyAny)));
        } catch (error) {
            if (hook.errorHook) {
                await run(hook.errorHook)
            }
        }
    }
};

export default { create, run };
