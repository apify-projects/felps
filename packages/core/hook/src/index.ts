import InstanceBase from '@usefelps/instance-base';
import { deduplicateFunctions } from '@usefelps/utils';
import * as FT from '@usefelps/types';

export const create = <
    HookParametersSignature extends FT.HookParametersSignatureDefault = FT.HookParametersSignatureDefault
>(options: FT.HookOptions<HookParametersSignature>): FT.HookInstance<HookParametersSignature> => {
    return {
        ...InstanceBase.create({ key: 'hook', name: options?.name || 'default' }),
        handlers: (options.handlers || []).filter(Boolean),
        validationHandler: options?.validationHandler || async function () { return true },
        onErrorHook: options?.onErrorHook,
    };
};

export const run = async <HookParametersSignature extends FT.HookParametersSignatureDefault = FT.HookParametersSignatureDefault>(hook: FT.HookInstance<HookParametersSignature>, ...args: HookParametersSignature): Promise<void> => {
    try {
        const valid = await hook.validationHandler(...(args as FT.ReallyAny));
        if (!valid) return;
    } catch (error) {
        return;
    }

    const handlers = deduplicateFunctions(hook.handlers);

    for (const handler of handlers) {
        try {
            await Promise.resolve(handler(...(args as FT.ReallyAny)));
        } catch (error) {
            if (hook.onErrorHook) {
                await hook.onErrorHook?.(error);
            } else {
                throw error;
            }
        }
    }
};

export default { create, run };
