"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__step_api_1 = tslib_1.__importDefault(require("@usefelps/core--step-api"));
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
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
        async flowHook(context) {
            const meta = core__request_meta_1.default.create(context.request);
            const stepApi = core__step_api_1.default.create(actor);
            if (meta.data.flowStart && context && !meta.data.isHook) {
                context.request.userData[CONST.METADATA_KEY].flowStart = false;
                const actorKey = meta.data.reference.fActorKey;
                await actor?.hooks?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, 'FLOW_STARTED')].handler?.(context, stepApi(context));
            }
        },
        async requestHook(context) {
            context?.page?.on?.('requestfailed', async (req) => {
                if ([context.request.url, context.request.loadedUrl].filter(Boolean).includes(req.url())) {
                    await (0, use_handle_request_error_function_1.default)(actor)(context);
                }
            });
            if (context?.response && context?.response?.status !== 200) {
                await (0, use_handle_request_error_function_1.default)(actor)(context);
            }
        },
        async intercepter(context) {
            const meta = core__request_meta_1.default.create(context.request);
            const stepApi = core__step_api_1.default.create(actor);
            const actorKey = meta.data.reference.fActorKey;
            await actor?.hooks?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, 'PRE_NAVIGATION')].handler?.(context, stepApi(context));
            // await context.page.route('**/*',
            //     async (route, req) => {
            //         if (req.isNavigationRequest()) {
            //             return route.abort(); // this will effectively make the request hang. aborting will make it navigate to the browser error page
            //         }
            //         await route.continue();
            //     }
            // );
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