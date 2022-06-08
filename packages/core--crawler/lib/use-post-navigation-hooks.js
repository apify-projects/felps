"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    // export default (actor: ActorInstance) => {
    // const logTrailHistory = (RequestContext: RequestContext) => {
    //     const trailId = RequestContext.request?.userData?.trailId;
    //     if (trailId) {
    //         const trail = new Trail({ id: trailId, context });
    //         trail.update(`requests`, { [`${RequestContext.request.id}`]: RequestContext.request });
    //     }
    // };
    return {
        async trailHook() {
            // async trailHook(RequestContext: RequestContext) {
            // const trailId = RequestContext.request?.userData?.trailId;
            // RequestContext.request.userData.endedAt = new Date().toISOString();
            // // eslint-disable-next-line max-len
            // eslint-disable-next-line max-len
            // RequestContext.request.userData.aggregatedDurationInMs = (new Date(RequestContext.request.userData.endedAt).getTime() - new Date(RequestContext.request.userData.startedAt).getTime());
            // if (trailId) {
            //     const trail = new Trail({ id: trailId, context });
            //     trail.add(`stats.aggregatedDurationInMs`, RequestContext.request.userData.aggregatedDurationInMs);
            //     trail.add(`stats.retries`, RequestContext.request.retryCount);
            //     trail.set(`stats.endedAt`, new Date().toISOString());
            // }
            // logTrailHistory(RequestContext);
        },
    };
};
//# sourceMappingURL=use-post-navigation-hooks.js.map