import mergeDeep from 'merge-deep';
import Model from '@usefelps/model';
import Trail from '@usefelps/trail';
import RequestMeta from '@usefelps/request-meta';
import Base from '@usefelps/instance-base';
import * as CONST from '@usefelps/constants';
import TrailDataRequests from '@usefelps/trail--data-requests';
import * as FT from '@usefelps/types';

export const create = <
    F extends Record<string, FT.FlowDefinition>,
    S,
    M extends Record<string, FT.ModelDefinition>
>(actor: FT.ActorInstance): FT.ContextApiFlowsInstance<F, S, M> => {
    return {
        ...Base.create({ key: 'context-api-flows', name: 'context-api-flows' }),
        handler(context) {
            const currentMeta = RequestMeta.create(context);
            const currentTrail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(currentTrail);

            const actorKey = currentMeta.data.reference.fActorKey as string;

            const actorKeyMustExists = () => {
                if (!actorKey) throw new Error('Actor key not found');
            };

            return {
                currentStep: () => CONST.PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.stepName),
                currentFlow: () => CONST.PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName),
                isStep(stepNameToTest, stepNameExpected) {
                    actorKeyMustExists();
                    return CONST.PREFIXED_NAME_BY_ACTOR(actorKey, stepNameToTest) === CONST.PREFIXED_NAME_BY_ACTOR(actorKey, stepNameExpected as string);
                },
                isSomeStep(stepNameToTest, stepNamesExpected) {
                    actorKeyMustExists();
                    return stepNamesExpected
                        .map((stepNameExpected) => CONST.PREFIXED_NAME_BY_ACTOR(actorKey, stepNameExpected as string))
                        .includes(CONST.PREFIXED_NAME_BY_ACTOR(actorKey, stepNameToTest));
                },
                isFlow(flowNameToTest, flowNameExpected) {
                    actorKeyMustExists();
                    return CONST.PREFIXED_NAME_BY_ACTOR(actorKey, flowNameToTest) === CONST.PREFIXED_NAME_BY_ACTOR(actorKey, flowNameExpected as string);
                },
                isSomeFlow(flowNameToTest, flowNamesExpected) {
                    actorKeyMustExists();
                    return flowNamesExpected
                        .map((flowNameExpected) => CONST.PREFIXED_NAME_BY_ACTOR(actorKey, flowNameExpected as string))
                        .includes(CONST.PREFIXED_NAME_BY_ACTOR(actorKey, flowNameToTest));
                },
                isCurrentActor(actorName) {
                    return actorKey === actorName;
                },
                isCurrentStep(stepName) {
                    return CONST.PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.stepName) === CONST.PREFIXED_NAME_BY_ACTOR(actorKey, stepName as string);
                },
                isCurrentFlow(flowName) {
                    return CONST.PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName) === CONST.PREFIXED_NAME_BY_ACTOR(actorKey, flowName as string);
                },
                asFlowName(flowName) {
                    actorKeyMustExists();
                    const prefixedFlowName = CONST.PREFIXED_NAME_BY_ACTOR(actorKey, flowName);
                    return Object.keys(actor.flows).includes(prefixedFlowName) ? prefixedFlowName : undefined;
                },
                asStepName(stepName) {
                    actorKeyMustExists();
                    const prefixedStepName = CONST.PREFIXED_NAME_BY_ACTOR(actorKey, stepName);
                    return Object.keys(actor.steps).includes(prefixedStepName) ? prefixedStepName : undefined;
                },
                start(flowName, request, input, options) {
                    const { useNewTrail = true } = options || {};
                    let { crawlerOptions, reference } = options || {};
                    actorKeyMustExists();

                    const flowNamePrefixed = CONST.PREFIXED_NAME_BY_ACTOR(actorKey, flowName);

                    const localTrail = useNewTrail ? Trail.create({ actor }) : currentTrail;

                    const flow = actor.flows?.[flowNamePrefixed] as FT.FlowInstance<Extract<keyof S, string>>;
                    const stepName = flow?.steps?.[0];
                    const step = actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, stepName)];

                    const currentFlow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data?.flowName)] as FT.FlowInstance<Extract<keyof S, string>>;
                    if (currentFlow && !(currentFlow.flows || []).includes(CONST.UNPREFIXED_NAME_BY_ACTOR(flowName))) {
                        throw new Error(`Flow ${flowName} is not runnable from current flow ${currentFlow.name}`);
                    };

                    const inputCompleted = { ...(input || {}), flow: CONST.UNPREFIXED_NAME_BY_ACTOR(flowName) };

                    Model.validate(flow.input, inputCompleted, { throwError: true });

                    crawlerOptions = mergeDeep(actor?.crawlerOptions || {}, flow?.crawlerOptions || {}, step?.crawlerOptions || {}, crawlerOptions || {});
                    reference = {
                        ...(currentMeta.data.reference || {}),
                        ...(reference || {}),
                        [CONST.TRAIL_KEY_PROP]: localTrail.id,
                    } as FT.ModelReference<FT.ReallyAny>;

                    const flowKey = Trail.setFlow(localTrail, {
                        name: flowNamePrefixed,
                        input: inputCompleted,
                        reference,
                        crawlerOptions,
                        output: undefined,
                    });

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
                            flowStart: true,
                            flowName: flowNamePrefixed,
                            stepName,
                            crawlerOptions,
                            reference: {
                                ...reference,
                                [CONST.FLOW_KEY_PROP]: flowKey,
                            },
                        },
                    );

                    const localIngested = Trail.ingested(localTrail);
                    TrailDataRequests.set(localIngested.requests, meta.request);
                    return meta.data.reference;
                },
                paginate(request, reference, options) {
                    return this.next(this.currentStep() as FT.ReallyAny, request, reference, options);
                },
                next(stepName, request, reference, options) {
                    let { crawlerOptions } = options || {};
                    actorKeyMustExists();

                    const flow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName)];
                    const step = actor.steps?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, stepName)];

                    crawlerOptions = mergeDeep(actor?.crawlerOptions || {}, flow?.crawlerOptions || {}, step?.crawlerOptions || {}, crawlerOptions || {});

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
                            flowStart: false,
                            stepName,
                            crawlerOptions,
                            reference: {
                                ...(reference || {}),
                                [CONST.TRAIL_KEY_PROP]: currentTrail.id,
                            },
                        },
                    );

                    TrailDataRequests.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
                nextDefault(request, reference, options) {
                    actorKeyMustExists();

                    const flow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName)];
                    const currentStepIndex = (flow?.steps || []).findIndex((localStepName: string) => localStepName
                        === CONST.UNPREFIXED_NAME_BY_ACTOR(currentMeta.data.stepName),
                    );
                    const nextName = currentStepIndex > -1 ? flow.steps[currentStepIndex + 1] : undefined;

                    if (!nextName) {
                        throw new Error(`No default step found for flow ${flow.name}`);
                    }

                    return this.next(nextName, request || { url: context.request.url, headers: context.request.headers }, reference, options);
                },
                stop() {
                    context.request.userData = RequestMeta.extend(currentMeta, { stepStop: true }).userData;
                },
                retry() {
                    throw new Error('Retry this step');
                },
            } as FT.ContextApiFlowsAPI<F, S, M>;
        },
    };
};

export default { create };