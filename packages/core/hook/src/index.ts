import BaseInstance from '@usefelps/instance-base';
import { deduplicateFunctions } from '@usefelps/utils';
import * as FT from '@usefelps/types';

export const create = <HookParametersSignature extends FT.HookParametersSignatureDefault = FT.HookParametersSignatureDefault>(options: FT.HookOptions<HookParametersSignature>): FT.HookInstance<HookParametersSignature> => {
    return {
        ...BaseInstance.create({ key: 'hook', name: options?.name || 'default' }),
        handlers: options.handlers.filter(Boolean),
        validationHandler: options?.validationHandler || async function () { return true },
        onErrorHook: 'onErrorHook' in options ? create({ ...(options.onErrorHook || {}), name: 'onErrorHook' }) : undefined,
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
            if (hook.onErrorHook) {
                await run(hook.onErrorHook)
            }
        }
    }
};

export default { create, run };
