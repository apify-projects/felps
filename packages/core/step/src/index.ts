import ContextApi from '@usefelps/context-api';
import Trail from '@usefelps/trail';
import TrailDataRequests from '@usefelps/trail--data-requests';
import Hook from '@usefelps/hook';
import InstanceBase from '@usefelps/instance-base';
import Logger from '@usefelps/logger';
import RequestMeta from '@usefelps/request-meta';
import * as FT from '@usefelps/types';
import { StepOptionsHandlerParameters } from '@usefelps/types';
import { pathify } from '@usefelps/utils';

export const create = <StepNames extends string = string>(options?: FT.StepOptions<StepNames>): FT.StepInstance<StepNames> => {
    const {
        name,
        crawlerMode,
        hooks = {},
        meta = {},
    } = options || {};

    const base = InstanceBase.create({ key: 'step', name });

    const validationHandler = async (...[_, api]: StepOptionsHandlerParameters) => {
        return meta?.actorName ? api.getActorName() === meta.actorName : true;
    }

    return {
        ...base,
        name: base.name as StepNames,
        crawlerMode,
        meta,
        hooks: {
            navigationHook: Hook.create({
                name: pathify(base.name, 'navigationHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.navigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.navigationHook?.onErrorHook,
            }),
            preNavigationHook: Hook.create({
                name: pathify(base.name, 'preNavigationHook'),
                validationHandler,
                handlers: [
                    async function SET_REQUEST_STATUS(context, _, actor) {
                        const trail = Trail.createFrom(context.request, { state: actor.stores.trails as FT.StateInstance });
                        const digested = Trail.digested(trail);
                        const meta = RequestMeta.create(context.request);

                        TrailDataRequests.setStatus(digested.requests, 'FAILED', meta.data.requestId);
                        // console.log('SET_REQUEST_STATUS', meta.data.requestId, TrailDataRequests.getItemsList(digested.requests))
                    },
                    ...(hooks?.preNavigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.preNavigationHook?.onErrorHook,
            }),
            postNavigationHook: Hook.create({
                name: pathify(base.name, 'postNavigationHook'),
                validationHandler,
                handlers: [
                    async function SET_REQUEST_STATUS(context, _, actor) {
                        const trail = Trail.createFrom(context.request, { state: actor.stores.trails as FT.StateInstance });
                        const digested = Trail.digested(trail);
                        const meta = RequestMeta.create(context.request);

                        TrailDataRequests.setStatus(digested.requests, 'SUCCEEDED', meta.data.requestId);
                    },
                    ...(hooks?.postNavigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.postNavigationHook?.onErrorHook,
            }),
            responseInterceptionHook: Hook.create({
                name: pathify(base.name, 'responseInterceptionHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.responseInterceptionHook?.handlers || []),
                ],
                onErrorHook: hooks?.responseInterceptionHook?.onErrorHook,
            }),
            preCrawlHook: Hook.create({
                name: pathify(base.name, 'preCrawlHook'),
                validationHandler,
                handlers: [
                    async function LOGGING(context) {
                        const meta = RequestMeta.create(context.request);

                        if (!meta.data.isHook && context?.request?.url) {
                            Logger.info(Logger.create({ id: 'any' }), `at ${context.request.url}`);
                        }
                    },
                    ...(hooks?.preCrawlHook?.handlers || []),
                ],
                onErrorHook: hooks?.preCrawlHook?.onErrorHook,
            }),
            postCrawlHook: Hook.create({
                name: pathify(base.name, 'postCrawlHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postCrawlHook?.handlers || []),
                ],
                onErrorHook: hooks?.postCrawlHook?.onErrorHook,
            }),
            postFailedHook: Hook.create({
                name: pathify(base.name, 'postFailedHook'),
                validationHandler,
                handlers: [
                    // async function setTrailStatus(context: FT.ReallyAny, api: FT.ReallyAny) {
                    //     // const trail = Trail.createFrom(context.request, { actor });
                    //     // const digest = Trail.digested(trail);
                    //     // const meta = RequestMeta.create(context.request);

                    //     // TrailDataRequests.setStatus(digest.requests, 'FAILED', meta.data.reference);
                    // },
                    ...(hooks?.postFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postFailedHook?.onErrorHook,
            }),
            postRequestFailedHook: Hook.create({
                name: pathify(base.name, 'postRequestFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postRequestFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.postRequestFailedHook?.onErrorHook,
            }),
        },
    };
};

export const run = async (step: FT.StepInstance | undefined, actor: FT.ActorInstance, context: FT.RequestContext | undefined): Promise<void> => {
    const ctx = RequestMeta.contextDefaulted(context);

    const contextApi = ContextApi.create(actor);

    try {
        await Hook.run(actor?.hooks?.preNavigationHook, actor, ctx);

        await Hook.run(step?.hooks?.preNavigationHook, ctx, contextApi(ctx), actor);

        /**
         * Run any logic for the navigation
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.navigationHook, ctx, contextApi(ctx), actor,);

        await Hook.run(step?.hooks?.postNavigationHook, ctx, contextApi(ctx), actor,);

        await Hook.run(actor?.hooks?.postNavigationHook, actor, ctx);

    } catch (error) {
        /**
         * Run any logic when an error occurs during the navigation
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.postFailedHook, ctx, contextApi(ctx), error, actor);

        throw error;
    }
};

export default { create, run };
