/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestMeta, StepApi } from '..';
import { METADATA_KEY, PREFIXED_NAME_BY_ACTOR } from '../consts';
import { ActorInstance, ReallyAny, RequestContext, StepInstance } from '../types';
import useHandleRequestErrorFunction from './use-handle-request-error-function';

export default (actor: ActorInstance) => {
    // const logTrailHistory = (RequestContext: RequestContext) => {
    //     const trailId = RequestContext.request?.userData?.trailId;
    //     if (trailId) {
    //         const trail = new Trail({ id: trailId });
    //         trail.update(`requests`, { [`${RequestContext.request.id}`]: RequestContext.request });
    //     }
    // };

    return {
        async flowHook(context: RequestContext) {
            const meta = RequestMeta.create(context.request);
            const stepApi = StepApi.create<ReallyAny, ReallyAny, ReallyAny, ReallyAny>(actor);

            if (meta.data.flowStart && context && !meta.data.isHook) {
                context.request.userData[METADATA_KEY].flowStart = false;
                const actorKey = meta.data.reference.fActorKey as string;
                await (actor?.hooks?.[PREFIXED_NAME_BY_ACTOR(actorKey, 'FLOW_STARTED') as 'FLOW_STARTED'] as StepInstance).handler?.(context, stepApi(context));
            }
        },
        async requestHook(context: RequestContext) {
            context?.page?.on?.('requestfailed', async (req) => {
                if ([context.request.url, context.request.loadedUrl].filter(Boolean).includes(req.url())) {
                    await useHandleRequestErrorFunction(actor)(context);
                }
            });

            if (context?.response && context?.response?.status !== 200) {
                await useHandleRequestErrorFunction(actor)(context);
            }
        },
        async trailHook() {
            // async trailHook(RequestContext: RequestContext) {
            // const trailId = RequestContext.request?.userData?.trailId;

            // RequestContext.request.userData.startedAt = new Date().toISOString();
            // RequestContext.request.userData.sizeInKb = 0;
            // logTrailHistory(RequestContext);

            // const handleResponseHtml = async (html: any) => {
            //     if (html) {
            //         const additionalSize = Math.floor(html.length / 1000);
            //         RequestContext.request.userData.sizeInKb += additionalSize;

            //         if (trailId) {
            //             const trail = new Trail({ id: trailId });
            //             trail.add(`stats.sizeInKb`, additionalSize);
            //         }
            //     }
            // };

            // if ('page' in RequestContext) {
            //     RequestContext.page.on('response', async (response) => {
            //         try {
            //             if (response.status() < 300 && response.status() >= 399) {
            //                 handleResponseHtml(await response.body());
            //             } else {
            //                 await useHandleRequestErrorFunction(actor)(RequestContext);
            //             }
            //         } catch (error) {
            //             // Fails on redirect, silently.
            //         }
            //     });
            // }

            // if ('$' in RequestContext) {
            //     handleResponseHtml(RequestContext.$.html());
            // }
        },
    };
};
