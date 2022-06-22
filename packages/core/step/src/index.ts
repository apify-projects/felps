import Hook from '@usefelps/hook';
import Base from '@usefelps/instance-base';
import RequestMeta from '@usefelps/request-meta';
import ContextApi from '@usefelps/context-api';
// import Trail from '@usefelps/trail';
// import TrailDataRequests from '@usefelps/trail--data-requests';
import { pathify } from '@usefelps/utils';
import Logger from '@usefelps/logger';
import * as FT from '@usefelps/types';
import { GeneralContextApi, StepOptionsHandlerParameters } from '@usefelps/types';

export const create = <Methods = unknown>(options?: FT.StepOptions<Methods>): FT.StepInstance<Methods> => {
    const {
        name,
        crawlerOptions,
        hooks = {},
        reference,
    } = options || {};

    const base = Base.create({ key: 'step', name: pathify(reference.fActorKey, name) });

    const validationHandler = async (...[_, api]: StepOptionsHandlerParameters<Methods & GeneralContextApi>) => {
        return reference?.fActorKey ? api.getActorName() === reference.fActorKey : true;
    }

    return {
        ...base,
        crawlerOptions,
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
        reference,
    };
};

export const createKeyed = <Methods = unknown>(options: FT.StepOptions<Methods>): { [name: FT.StepOptions<Methods>['name']]: FT.StepInstance<Methods> } => {
    const instance = create(options);
    return { [instance.name]: instance };
};

export const run = async (step: FT.StepInstance | undefined, actor: FT.ActorInstance, context: FT.RequestContext | undefined): Promise<void> => {
    const ctx = RequestMeta.contextDefaulted(context);
    ctx.request.userData = RequestMeta.extend(RequestMeta.create(ctx.request), { reference: step.reference }).userData;

    const stepApi = ContextApi.create(actor);

    try {
        /**
         * Run any logic before the navigation occurs
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.preNavigationHook, ctx, stepApi(ctx));

        /**
         * Run any logic for the navigation
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.navigationHook, ctx, stepApi(ctx));

        /**
         * Run any logic after the navigation occurs
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.postNavigationHook, ctx, stepApi(ctx));

    } catch (error) {
        /**
         * Run any logic when an error occurs during the navigation
         * By default: (does nothing for now)
         */
        await Hook.run(step?.hooks?.onErrorHook, ctx, stepApi(ctx), error);

        throw error;

    }
};

export default { create, createKeyed, run };
