import Hook from '@usefelps/core--hook';
import Base from '@usefelps/core--instance-base';
import RequestMeta from '@usefelps/core--request-meta';
import StepApi from '@usefelps/core--step-api';
// import Trail from '@usefelps/core--trail';
// import TrailDataRequests from '@usefelps/core--trail--data-requests';
import { pathify } from '@usefelps/helper--utils';
import Logger from '@usefelps/helper--logger';
import * as FT from '@usefelps/types';
import { GeneralStepApi, StepOptionsHandlerParameters } from '@usefelps/types';

export const create = <Methods = unknown>(options?: FT.StepOptions<Methods>): FT.StepInstance<Methods> => {
    const {
        name,
        crawlerOptions,
        hooks = {},
        reference,
    } = options || {};

    const base = Base.create({ key: 'step', name: pathify(reference.fActorKey, name) });

    const validationHandler = async (...[_, api]: StepOptionsHandlerParameters<Methods & GeneralStepApi>) => {
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

export const run = async (step: FT.StepInstance | undefined, actor: FT.ActorInstance, context: FT.RequestContext | undefined): Promise<void> => {
    const ctx = RequestMeta.contextDefaulted(context);
    ctx.request.userData = RequestMeta.extend(RequestMeta.create(ctx.request), { reference: step.reference }).userData;

    const stepApi = StepApi.create(actor);

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

export default { create, run };
