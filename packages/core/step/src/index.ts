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
            mainHook: Hook.create({
                name: pathify(base.name, 'mainHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.mainHook?.handlers || []),
                ],
                onErrorHook: hooks?.mainHook?.onErrorHook,
            }),
            preMainHook: Hook.create({
                name: pathify(base.name, 'preMainHook'),
                validationHandler,
                handlers: [
                    async function SET_REQUEST_STATUS(context, _, actor) {
                        const trail = Trail.createFrom(context.request, { state: actor.stores.trails as FT.StateInstance });
                        const digested = Trail.digested(trail);
                        const meta = RequestMeta.create(context.request);

                        TrailDataRequests.setStatus(digested.requests, 'STARTED', meta.data.requestId);
                        // console.log('SET_REQUEST_STATUS', meta.data.requestId, TrailDataRequests.getItemsList(digested.requests))
                    },
                    ...(hooks?.preMainHook?.handlers || []),
                ],
                onErrorHook: hooks?.preMainHook?.onErrorHook,
            }),
            postMainHook: Hook.create({
                name: pathify(base.name, 'postMainHook'),
                validationHandler,
                handlers: [
                    async function SET_REQUEST_STATUS(context, _, actor) {
                        const trail = Trail.createFrom(context.request, { state: actor.stores.trails as FT.StateInstance });
                        const digested = Trail.digested(trail);
                        const meta = RequestMeta.create(context.request);

                        TrailDataRequests.setStatus(digested.requests, 'SUCCEEDED', meta.data.requestId);
                    },
                    ...(hooks?.postMainHook?.handlers || []),
                ],
                onErrorHook: hooks?.postMainHook?.onErrorHook,
            }),
            routeInterceptionHook: Hook.create({
                name: pathify(base.name, 'routeInterceptionHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.routeInterceptionHook?.handlers || []),
                ],
                onErrorHook: hooks?.routeInterceptionHook?.onErrorHook,
            }),
            responseInterceptionHook: Hook.create({
                name: pathify(base.name, 'responseInterceptionHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.responseInterceptionHook?.handlers || []),
                ],
                onErrorHook: hooks?.responseInterceptionHook?.onErrorHook,
            }),
            preNavigationHook: Hook.create<[actor: FT.ActorInstance, context: FT.RequestContext, api: FT.TContextApi, goToOptions: Record<PropertyKey, any>]>({
                name: pathify(base.name, 'preNavigationHook'),
                async validationHandler(actor, context, api) {
                    return validationHandler(context, api, actor);
                },
                handlers: [
                    async function LOGGING(_, context) {
                        if (context?.request?.url) {
                            Logger.info(Logger.create({ id: 'any' }), `at ${context.request.url}`);
                        }
                    },
                    ...(hooks?.preNavigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.preNavigationHook?.onErrorHook,
            }),
            postNavigationHook: Hook.create<[actor: FT.ActorInstance, context: FT.RequestContext, api: FT.TContextApi, goToOptions: Record<PropertyKey, any>]>({
                name: pathify(base.name, 'postNavigationHook'),
                async validationHandler(actor, context, api) {
                    return validationHandler(context, api, actor);
                },
                handlers: [
                    ...(hooks?.postNavigationHook?.handlers || []),
                ],
                onErrorHook: hooks?.postNavigationHook?.onErrorHook,
            }),
            preFailedHook: Hook.create<[context: FT.RequestContext, api: FT.TContextApi, error: FT.ReallyAny, actor: FT.ActorInstance]>({
                name: pathify(base.name, 'preFailedHook'),
                validationHandler,
                handlers: [
                    async function SET_REQUEST_STATUS(context, _, __, actor) {
                        const trail = Trail.createFrom(context.request, { state: actor.stores.trails as FT.StateInstance });
                        const digested = Trail.digested(trail);
                        const meta = RequestMeta.create(context.request);

                        TrailDataRequests.setStatus(digested.requests, 'FAILED', meta.data.requestId);
                    },
                    ...(hooks?.preFailedHook?.handlers || []),
                ],
                onErrorHook: hooks?.preFailedHook?.onErrorHook,
            }),
            postFailedHook: Hook.create<[context: FT.RequestContext, api: FT.TContextApi, error: FT.ReallyAny, actor: FT.ActorInstance]>({
                name: pathify(base.name, 'postFailedHook'),
                validationHandler,
                handlers: [
                    ...(hooks?.postFailedHook?.handlers || [
                        async (_, __, error) => { throw error; }
                    ]),
                ],
                onErrorHook: hooks?.postFailedHook?.onErrorHook,
            }),
            postRequestFailedHook: Hook.create({
                name: pathify(base.name, 'postRequestFailedHook'),
                validationHandler,
                handlers: [
                    async function SET_REQUEST_STATUS(context: FT.ReallyAny, _, actor) {
                        const trail = Trail.createFrom(context.request, { state: actor.stores.trails as FT.StateInstance });
                        const digested = Trail.digested(trail);
                        const meta = RequestMeta.create(context.request);

                        TrailDataRequests.setStatus(digested.requests, 'DISCARDED', meta.data.requestId);
                    },
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

    const meta = RequestMeta.create(ctx as FT.RequestContext);

    try {
        if (meta.data.startFlow) {
            const currentFlow = actor.flows?.[meta.data.flowName]

            await Hook.run(actor?.hooks?.preFlowStartedHook, actor, ctx, contextApi(ctx));

            await Hook.run(currentFlow?.hooks?.postEndHook, context, contextApi(context), actor);
        }

        if (!step) {
            throw new Error(`Step not found ${step}`);
        }

        await Hook.run(actor?.hooks?.preStepStartedHook, actor, ctx, contextApi(ctx));

        await Hook.run(actor?.hooks?.preStepMainHook, actor, ctx, contextApi(ctx));

        await Hook.run(step?.hooks?.preMainHook, ctx, contextApi(ctx), actor);

        if (meta.data.stopStep) {
            // Stop the step now (finally {} runs first)
            return;
        }

        /**
         * Run any logic for the navigation
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.mainHook, ctx, contextApi(ctx), actor);

        await Hook.run(step?.hooks?.postMainHook, ctx, contextApi(ctx), actor);

        await Hook.run(actor?.hooks?.postStepMainHook, actor, ctx, contextApi(ctx));

    } catch (error) {
        try {
            await Hook.run(step?.hooks?.preFailedHook, ctx, contextApi(ctx), error, actor);

            await Hook.run(actor?.hooks?.preStepFailedHook, actor, ctx, contextApi(ctx), error);

            await Hook.run(step?.hooks?.postFailedHook, ctx, contextApi(ctx), error, actor);

        } catch (err) {
            throw err;
        }

    } finally {
        await Hook.run(actor?.hooks?.postStepEndedHook, actor, ctx, contextApi(ctx));
    }
};

export default { create, run };
