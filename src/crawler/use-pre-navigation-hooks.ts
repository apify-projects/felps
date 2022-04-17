/* eslint-disable @typescript-eslint/no-explicit-any */
import useHandleRequestErrorFunction from './use-handle-request-error-function';
import { ActorInstance, RequestContext } from '../common/types';

export default (actor: ActorInstance) => {
    // const logTrailHistory = (crawlingContext: RequestContext) => {
    //     const trailId = crawlingContext.request?.userData?.trailId;
    //     if (trailId) {
    //         const trail = new Trail({ id: trailId });
    //         trail.update(`requests`, { [`${crawlingContext.request.id}`]: crawlingContext.request });
    //     }
    // };

    return {
        async requestHook(crawlingContext: RequestContext) {
            crawlingContext.page.on('requestfailed', async () => {
                await useHandleRequestErrorFunction(actor)(crawlingContext);
            });
        },
        async trailHook() {
        // async trailHook(crawlingContext: RequestContext) {
            // const trailId = crawlingContext.request?.userData?.trailId;

            // crawlingContext.request.userData.startedAt = new Date().toISOString();
            // crawlingContext.request.userData.sizeInKb = 0;
            // logTrailHistory(crawlingContext);

            // const handleResponseHtml = async (html: any) => {
            //     if (html) {
            //         const additionalSize = Math.floor(html.length / 1000);
            //         crawlingContext.request.userData.sizeInKb += additionalSize;

            //         if (trailId) {
            //             const trail = new Trail({ id: trailId });
            //             trail.add(`stats.sizeInKb`, additionalSize);
            //         }
            //     }
            // };

            // if ('page' in crawlingContext) {
            //     crawlingContext.page.on('response', async (response) => {
            //         try {
            //             if (response.status() < 300 && response.status() >= 399) {
            //                 handleResponseHtml(await response.body());
            //             } else {
            //                 await useHandleRequestErrorFunction(actor)(crawlingContext);
            //             }
            //         } catch (error) {
            //             // Fails on redirect, silently.
            //         }
            //     });
            // }

            // if ('$' in crawlingContext) {
            //     handleResponseHtml(crawlingContext.$.html());
            // }
        },
    };
};
