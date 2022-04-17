/* eslint-disable @typescript-eslint/no-explicit-any */

export default () => {
    // export default (actor: ActorInstance) => {
    // const logTrailHistory = (crawlingContext: RequestContext) => {
    //     const trailId = crawlingContext.request?.userData?.trailId;
    //     if (trailId) {
    //         const trail = new Trail({ id: trailId, context });
    //         trail.update(`requests`, { [`${crawlingContext.request.id}`]: crawlingContext.request });
    //     }
    // };

    return {
        async trailHook() {
            // async trailHook(crawlingContext: RequestContext) {
            // const trailId = crawlingContext.request?.userData?.trailId;
            // crawlingContext.request.userData.endedAt = new Date().toISOString();
            // // eslint-disable-next-line max-len
            // eslint-disable-next-line max-len
            // crawlingContext.request.userData.aggregatedDurationInMs = (new Date(crawlingContext.request.userData.endedAt).getTime() - new Date(crawlingContext.request.userData.startedAt).getTime());

            // if (trailId) {
            //     const trail = new Trail({ id: trailId, context });

            //     trail.add(`stats.aggregatedDurationInMs`, crawlingContext.request.userData.aggregatedDurationInMs);
            //     trail.add(`stats.retries`, crawlingContext.request.retryCount);
            //     trail.set(`stats.endedAt`, new Date().toISOString());
            // }

            // logTrailHistory(crawlingContext);
        },
    };
};
