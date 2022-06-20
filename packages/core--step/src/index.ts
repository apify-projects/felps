import Hook from '@usefelps/core--hook';
import Base from '@usefelps/core--instance-base';
import RequestMeta from '@usefelps/core--request-meta';
import StepApi from '@usefelps/core--step-api';
// import Trail from '@usefelps/core--trail';
// import TrailDataRequests from '@usefelps/core--trail--data-requests';
import { pathify } from '@usefelps/helper--utils';
import * as FT from '@usefelps/types';
import { GeneralStepApi, StepOptionsHandlerParameters } from '@usefelps/types';

// export const HOOKS = {
//     postNavigationHook: [
//         function logStepContent(context: FT.ReallyAny, api: FT.ReallyAny) {
//             const meta = RequestMeta.create(context.request);

//             if (!meta.data.isHook && context?.request?.url) {
//                 Logger.info(Logger.create(api.getStep()), `at ${context.request.url}`);
//             }
//         },
//         // function setTrailStatus(context: FT.ReallyAny, api: FT.ReallyAny) {
//         //     // const trail = Trail.createFrom(context.request, { actor });
//         //     // const digest = Trail.digested(trail);
//         //     // const meta = RequestMeta.create(context.request);

//         //     // TrailDataRequests.setStatus(digest.requests, 'FAILED', meta.data.reference);
//         // }
//     ],
//     errorHook: [
//         // function setTrailStatus(context: FT.ReallyAny, api: FT.ReallyAny) {
//         //     // const trail = Trail.createFrom(context.request, { actor });
//         //     // const digest = Trail.digested(trail);
//         //     // const meta = RequestMeta.create(context.request);

//         //     // TrailDataRequests.setStatus(digest.requests, 'FAILED', meta.data.reference);
//         // }
//     ]
// }

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
            navigationHook: Hook.create<StepOptionsHandlerParameters<Methods & GeneralStepApi>>({
                ...(hooks?.navigationHook || {}) as FT.ReallyAny,
                name: pathify(base.name, 'navigationHook'),
                validationHandler
            }),
            postNavigationHook: Hook.create<StepOptionsHandlerParameters<Methods & GeneralStepApi>>({
                ...(hooks?.postNavigationHook || {}) as FT.ReallyAny,
                name: pathify(base.name, 'postNavigationHook'),
                validationHandler
            }),
            preNavigationHook: Hook.create<StepOptionsHandlerParameters<Methods & GeneralStepApi>>({
                ...(hooks?.preNavigationHook || {}) as FT.ReallyAny,
                name: pathify(base.name, 'preNavigationHook'),
                validationHandler
            }),
            errorHook: Hook.create<StepOptionsHandlerParameters<Methods & GeneralStepApi>>({
                ...(hooks?.errorHook || {}) as FT.ReallyAny,
                name: pathify(base.name, 'errorHook'),
                validationHandler
            }),
            requestErrorHook: Hook.create<StepOptionsHandlerParameters<Methods & GeneralStepApi>>({
                ...(hooks?.requestErrorHook || {}) as FT.ReallyAny,
                name: pathify(base.name, 'requestErrorHook'),
                validationHandler
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
        await Hook.run(step?.hooks?.preNavigationHook, ctx, stepApi(ctx));

        await Hook.run(step?.hooks?.navigationHook, ctx, stepApi(ctx));

        await Hook.run(step?.hooks?.postNavigationHook, ctx, stepApi(ctx));

    } catch (error) {
        await Hook.run(step?.hooks?.errorHook, ctx, stepApi(ctx));
        throw error;
    }
};

export default { create, run };
