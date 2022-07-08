import * as CONST from '@usefelps/constants';
import Base from '@usefelps/instance-base';
import TrailDataRequests from '@usefelps/trail--data-requests';
import Trail from '@usefelps/trail';
import RequestMeta from '@usefelps/request-meta';
import * as FT from '@usefelps/types';

export const create = (actor: FT.ActorInstance): FT.ContextApiFlowsInstance => {
    return {
        ...Base.create({ key: 'context-api-flows', name: 'context-api-flows' }),
        handler(context) {
            const currentMeta = RequestMeta.create(context);
            const currentTrail = Trail.createFrom(context?.request, { state: actor?.stores?.trails as FT.StateInstance });

            const actorName = currentMeta.data.actorName || actor.name;

            return {
                currentActor: () => actor,
                currentStep: () => CONST.PREFIXED_NAME_BY_ACTOR(actorName, currentMeta.data.stepName),
                currentFlow: () => CONST.PREFIXED_NAME_BY_ACTOR(actorName, currentMeta.data.flowName),
                isStep(stepNameToTest, stepNameExpected) {
                    return CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepNameToTest) === CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepNameExpected);
                },
                isSomeStep(stepNameToTest, stepNamesExpected) {
                    return stepNamesExpected
                        .map((stepNameExpected) => CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepNameExpected))
                        .includes(CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepNameToTest));
                },
                isFlow(flowNameToTest, flowNameExpected) {
                    return CONST.PREFIXED_NAME_BY_ACTOR(actorName, flowNameToTest) === CONST.PREFIXED_NAME_BY_ACTOR(actorName, flowNameExpected);
                },
                isSomeFlow(flowNameToTest, flowNamesExpected) {
                    return flowNamesExpected
                        .map((flowNameExpected) => CONST.PREFIXED_NAME_BY_ACTOR(actorName, flowNameExpected))
                        .includes(CONST.PREFIXED_NAME_BY_ACTOR(actorName, flowNameToTest));
                },
                isCurrentActor(actorName) {
                    return actorName === actorName;
                },
                isCurrentStep(stepName) {
                    return CONST.PREFIXED_NAME_BY_ACTOR(actorName, currentMeta.data.stepName) === CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepName);
                },
                isCurrentFlow(flowName) {
                    return CONST.PREFIXED_NAME_BY_ACTOR(actorName, currentMeta.data.flowName) === CONST.PREFIXED_NAME_BY_ACTOR(actorName, flowName);
                },
                asFlowName(flowName) {
                    const prefixedFlowName = CONST.PREFIXED_NAME_BY_ACTOR(actorName, flowName);
                    return Object.keys(actor.flows).includes(prefixedFlowName) ? prefixedFlowName : undefined;
                },
                asStepName(stepName) {
                    const prefixedStepName = CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepName);
                    return Object.keys(actor.steps).includes(prefixedStepName) ? prefixedStepName : undefined;
                },
                start(flowName, request, input, options) {
                    const { useNewTrail = true } = options || {};
                    let { crawlerMode } = options || {};

                    const flowNamePrefixed = CONST.PREFIXED_NAME_BY_ACTOR(actorName, flowName);

                    const localTrail = useNewTrail ? Trail.create({ state: actor?.stores?.trails as FT.StateInstance }) : currentTrail;

                    const flow = actor.flows?.[flowNamePrefixed];
                    const stepName = flow?.steps?.[0];
                    const stepNamePrefixed = CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepName);
                    const step = actor.steps?.[stepNamePrefixed]

                    // console.log({ flows: actor.flows, flowNamePrefixed, flow, stepName, stepNamePrefixed, step })

                    const inputCompleted = { ...(input || {}), flow: CONST.UNPREFIXED_NAME_BY_ACTOR(flowName) };

                    crawlerMode = actor?.crawlerMode || flow?.crawlerMode || step?.crawlerMode || crawlerMode || 'http';

                    const flowKey = Trail.setFlow(localTrail, {
                        name: flowNamePrefixed,
                        input: inputCompleted,
                        output: undefined,
                    });

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
                            startFlow: true,
                            actorName,
                            flowName: flowNamePrefixed,
                            stepName,
                            crawlerMode,
                            flowKey,
                            trailKey: localTrail.id,
                        },
                    );

                    const localIngested = Trail.ingested(localTrail);
                    TrailDataRequests.set(localIngested.requests, meta.request);

                    return meta.data.flowKey;
                },
                paginate(request, options) {
                    return this.next(this.currentStep() as FT.ReallyAny, request, options);
                },
                next() {
                    // stepName, request, options
                    // let { crawlerOptions } = options || {};


                    // const flow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, currentMeta.data.flowName)];
                    // const step = actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepName)];

                    // crawlerOptions = mergeDeep(actor?.crawlerOptions || {}, flow?.crawlerOptions || {}, step?.crawlerOptions || {}, crawlerOptions || {});

                    // const meta = RequestMeta.extend(
                    //     RequestMeta.create(request),
                    //     currentMeta.data,
                    //     {
                    //         startFlow: false,
                    //         stepName,
                    //         crawlerOptions,
                    //         reference: {
                    //             ...(reference || {}),
                    //             [CONST.TRAIL_KEY_PROP]: currentTrail.id,
                    //         },
                    //     },
                    // );

                    // TrailDataRequests.set(ingest.requests, meta.request);
                    // return meta.data.reference;
                },
                stop() {
                    context.request.userData = RequestMeta.extend(currentMeta, { stopStep: true }).userData;
                },
                retry() {
                    throw new Error('Retry this step');
                }
            } as FT.ContextApiFlowsAPI;
        },
    };
};

export default { create };
