import * as CONST from '@usefelps/constants';
import InstanceBase from '@usefelps/instance-base';
import Logger from '@usefelps/logger';
import TrailDataRequests from '@usefelps/trail--data-requests';
import TrailDataState from '@usefelps/trail--data-state';
import Trail from '@usefelps/trail';
import RequestMeta from '@usefelps/request-meta';
import * as FT from '@usefelps/types';

export const create = (actor: FT.ActorInstance): FT.ContextApiFlowsInstance => {
    return {
        ...InstanceBase.create({ key: 'context-api-flows', name: 'context-api-flows' }),
        handler(context) {
            const currentMeta = RequestMeta.create(context);
            const currentTrail = Trail.createFrom(context?.request, { state: actor?.stores?.trails as FT.StateInstance });
            const ingested = Trail.ingested(currentTrail);

            const actorName = currentMeta.data.actorName || actor.name;

            const logger = Logger.create(InstanceBase.create({ name: 'context-api-flow', key: 'context-api-flow' }));

            return {
                currentActor: () => actor,
                currentStep: () => CONST.PREFIXED_NAME_BY_ACTOR(actorName, currentMeta.data.stepName),
                currentFlow: () => CONST.PREFIXED_NAME_BY_ACTOR(actorName, currentMeta.data.flowName),
                hasHadEnqueuedRequests: () => {
                    const queue = actor.queues?.default;
                    return queue.lastInfo.totalRequestCount > 0;
                },
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
                    if (!request?.url) {
                        Logger.info(logger, `Flow ${flowName} not started because request url is not defined`);
                        return undefined;
                    }

                    const { useNewTrail = true } = options || {};

                    const flowNamePrefixed = CONST.PREFIXED_NAME_BY_ACTOR(actorName, flowName);

                    const localTrail = useNewTrail ? Trail.create({ state: actor?.stores?.trails as FT.StateInstance }) : currentTrail;

                    const flow = actor.flows?.[flowNamePrefixed];
                    const stepName = flow?.steps?.[0];
                    const stepNamePrefixed = CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepName);
                    const step = actor.steps?.[stepNamePrefixed]

                    // console.log('start', { trailId: localTrail.id })

                    // console.log({ flows: actor.flows, flowNamePrefixed, flow, stepName, stepNamePrefixed, step })

                    const crawlerMode = options?.crawlerMode || step?.crawlerMode || flow?.crawlerMode || actor?.crawlerMode || 'http';

                    const flowId = Trail.setFlow(localTrail, {
                        name: flowNamePrefixed,
                        input,
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
                            flowId,
                            trailId: localTrail.id,
                        },
                    );


                    const localIngested = Trail.ingested(localTrail);
                    TrailDataRequests.set(localIngested.requests, meta.request);

                    return meta.data.flowId;
                },
                paginate(request, options) {
                    if (!request?.url) {
                        Logger.info(logger, `Pagination on step not started because request url is not defined`);
                        return undefined;
                    }

                    return this.next(this.currentStep() as FT.ReallyAny, request, options);
                },
                next(stepName, request, options) {
                    if (!request?.url) {
                        Logger.info(logger, `Next step not started because request url is not defined`);
                        return undefined;
                    }

                    const flow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, currentMeta.data.flowName)];
                    const step = actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(actorName, stepName)];

                    const crawlerMode = options.crawlerMode || step?.crawlerMode || flow?.crawlerMode || actor?.crawlerMode || 'http';

                    const meta = RequestMeta.extend(
                        RequestMeta.create({
                            ...request,
                            userData: {
                                ...currentMeta.userData,
                                ...request.userData,
                            }
                        }),
                        currentMeta.data,
                        {
                            startFlow: false,
                            stepName,
                            crawlerMode,
                            trailId: currentTrail.id,
                        },
                    );

                    const requestId = TrailDataRequests.set(ingested.requests, meta.request);

                    // console.log('TrailDataRequests', TrailDataRequests.getItems(ingested.requests));

                    return requestId;
                },
                stop(options) {
                    context.request.userData = RequestMeta.extend(currentMeta, { stopStep: true, stopFlow: options?.flow }).userData;
                    if (options?.flow) {
                        Trail.setStatus(currentTrail, 'STOPPED');
                    }
                },
                retry() {
                    //TODO: NEED TO CHANGE THIS
                    throw new Error('Retry this step');
                },
                getState(path) {
                    return TrailDataState.get(ingested.state, path);
                },
                setState(state, path) {
                    return TrailDataState.set(ingested.state, state, path);
                }
            } as FT.ContextApiFlowsAPI;
        },
    };
};

export default { create };
