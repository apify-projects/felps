import * as CONST from '@usefelps/constants';
import Hook from '@usefelps/hook';
import InstanceBase from '@usefelps/instance-base';
import * as FT from '@usefelps/types';
import { pathify } from '@usefelps/utils';

export const create = <
    FlowNames extends string = string,
    StepNames extends string = string,
>(options: FT.FlowOptions<FlowNames, StepNames>): FT.FlowInstance<FlowNames, StepNames> => {
    const { name, crawlerMode, steps = [], meta = {}, hooks = {} } = options || {};

    const base = InstanceBase.create({ key: 'flow', name });

    return {
        ...base,
        name: base.name as FlowNames,
        crawlerMode,
        steps,
        meta,
        hooks: {
            preStartedHook: Hook.create({
                name: pathify(base.name, 'preStartedHook'),
                handlers: hooks?.preStartedHook?.handlers || [],
                onErrorHook: hooks?.preStartedHook?.onErrorHook,
            }),
            postEndedHook: Hook.create({
                name: pathify(base.name, 'postEndedHook'),
                handlers: hooks?.postEndedHook?.handlers || [],
                onErrorHook: hooks?.postEndedHook?.onErrorHook,
            }),
            preFailedHook: Hook.create({
                name: pathify(base.name, 'preFailedHook'),
                handlers: hooks?.preFailedHook?.handlers || [],
                onErrorHook: hooks?.preFailedHook?.onErrorHook,
            }),
            postFailedHook: Hook.create({
                name: pathify(base.name, 'postFailedHook'),
                handlers: hooks?.postFailedHook?.handlers || [],
                onErrorHook: hooks?.postFailedHook?.onErrorHook,
            }),
            routeInterceptionHook: Hook.create({
                name: pathify(base.name, 'routeInterceptionHook'),
                handlers: [
                    ...(hooks?.routeInterceptionHook?.handlers || []),
                ],
                onErrorHook: hooks?.routeInterceptionHook?.onErrorHook,
            }),
            postResponseReceivedHook: Hook.create({
                name: pathify(base.name, 'postResponseReceivedHook'),
                handlers: [
                    ...(hooks?.postResponseReceivedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postResponseReceivedHook?.onErrorHook,
            }),

            prePageOpenedScriptInjection: Hook.create({
                name: pathify(base.name, 'prePageOpenedScriptInjection'),
                handlers: [
                    ...(hooks?.prePageOpenedScriptInjection?.handlers || []),
                ],
                onErrorHook: hooks?.prePageOpenedScriptInjection?.onErrorHook,
            }),

            preAnyPageOpenedScriptInjection: Hook.create({
                name: pathify(base.name, 'preAnyPageOpenedScriptInjection'),
                handlers: [
                    ...(hooks?.preAnyPageOpenedScriptInjection?.handlers || []),
                ],
                onErrorHook: hooks?.preAnyPageOpenedScriptInjection?.onErrorHook,
            }),
        }
    };
};

export const has = (flow: FT.FlowInstance, stepName: string): boolean => {
    return (flow.steps || []).some((name: any) => CONST.UNPREFIXED_NAME_BY_ACTOR(name) === CONST.UNPREFIXED_NAME_BY_ACTOR(stepName));
};

export default { create, has };
