import Hook from '@usefelps/hook';
import Base from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import ContextApi from '@usefelps/context-api';
import { pathify } from '@usefelps/utils';
import Logger from '@usefelps/logger';
import * as FT from '@usefelps/types';
import { TContextApi, StepOptionsHandlerParameters } from '@usefelps/types';

export const create = <StepNames extends string = string>(options?: FT.StepOptions<StepNames>): FT.StepInstance<StepNames> => {
    const {
        name,
        crawlerMode,
        crawlerOptions,
        hooks = {},
        meta = {},
    } = options || {};

    const base = Base.create({ key: 'step', name });

    const validationHandler = async (...[_, api]: StepOptionsHandlerParameters<TContextApi>) => {
        return meta?.actorName ? api.getActorName() === meta.actorName : true;
    }

    return {
        ...base,
        name: base.name as StepNames,
        crawlerMode,
        crawlerOptions,
        meta,
        hooks: {
            navigationHook: Hook.create({
                name: pathify(base.name, 'navigationHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.navigationHook?.handlers || []),
                ],
            }),
            postNavigationHook: Hook.create({
                name: pathify(base.name, 'postNavigationHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postNavigationHook?.handlers || []),
                ],
            }),
            preNavigationHook: Hook.create({
                name: pathify(base.name, 'preNavigationHook'),
                validationHandler,
                handlers: [
                    async function LOGGING(context) {
                        const meta = RequestMeta.create(context.request);

                        if (!meta.data.isHook && context?.request?.url) {
                            // TODO: fix api.getStep()
                            Logger.info(Logger.create({ id: 'any' }), `at ${context.request.url}`);
                        }
                    },
                    // async function setTrailStatus(context: FT.ReallyAny, api: FT.ReallyAny) {
                    //     // const trail = Trail.createFrom(context.request, { actor });
                    //     // const digest = Trail.digested(trail);
                    //     // const meta = RequestMeta.create(context.request);

                    //     // TrailDataRequests.setStatus(digest.requests, 'FAILED', meta.data.reference);
                    // },
                    ...(hooks?.preNavigationHook?.handlers || []),
                ],
            }),
            onErrorHook: Hook.create({
                name: pathify(base.name, 'onErrorHook'),
                validationHandler,
                handlers: [
                    // async function setTrailStatus(context: FT.ReallyAny, api: FT.ReallyAny) {
                    //     // const trail = Trail.createFrom(context.request, { actor });
                    //     // const digest = Trail.digested(trail);
                    //     // const meta = RequestMeta.create(context.request);

                    //     // TrailDataRequests.setStatus(digest.requests, 'FAILED', meta.data.reference);
                    // },
                    ...(hooks?.onErrorHook?.handlers || []),
                ],
            }),
            onRequestErrorHook: Hook.create({
                name: pathify(base.name, 'onRequestErrorHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.onRequestErrorHook?.handlers || []),
                ],
            }),
        },
    };
};

export const run = async (step: FT.StepInstance | undefined, actor: FT.ActorInstance, context: FT.RequestContext | undefined): Promise<void> => {
    const ctx = RequestMeta.contextDefaulted(context);

    const contextApi = ContextApi.create(actor);

    try {
        /**
         * Run any logic before the navigation occurs
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.preNavigationHook, ctx, contextApi(ctx));

        /**
         * Run any logic for the navigation
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.navigationHook, ctx, contextApi(ctx));

        /**
         * Run any logic after the navigation occurs
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.postNavigationHook, ctx, contextApi(ctx));

    } catch (error) {
        /**
         * Run any logic when an error occurs during the navigation
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.onErrorHook, ctx, contextApi(ctx), error);

        throw error;

    }
};

export default { create, run };
