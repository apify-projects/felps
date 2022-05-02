"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const use_handle_request_error_function_1 = tslib_1.__importDefault(require("./use-handle-request-error-function"));
exports.default = (actor) => {
    // const logTrailHistory = (RequestContext: RequestContext) => {
    //     const trailId = RequestContext.request?.userData?.trailId;
    //     if (trailId) {
    //         const trail = new Trail({ id: trailId });
    //         trail.update(`requests`, { [`${RequestContext.request.id}`]: RequestContext.request });
    //     }
    // };
    return {
        async requestHook(RequestContext) {
            RequestContext.page.on('requestfailed', async () => {
                await (0, use_handle_request_error_function_1.default)(actor)(RequestContext);
            });
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
//# sourceMappingURL=use-pre-navigation-hooks.js.map