import { Model, RequestMeta, Trail } from '.';
import base from './base';
import { FLOW_KEY_PROP, PREFIXED_NAME_BY_ACTOR, TRAIL_KEY_PROP, UNPREFIXED_NAME_BY_ACTOR } from './consts';
import TrailDataRequests from './trail-data-requests';
import { ActorInstance, FlowDefinition, FlowInstance, ModelDefinition, ModelReference, ReallyAny, StepApiFlowsAPI, StepApiFlowsInstance } from './types';

export const create = <
    F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition>>(actor: ActorInstance): StepApiFlowsInstance<F, S, M> => {
    return {
        ...base.create({ key: 'step-api-flows', name: 'step-api-flows' }),
        handler(context) {
            const currentMeta = RequestMeta.create(context);
            const currentTrail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(currentTrail);

            const actorKey = currentMeta.data.reference.fActorKey as string;

            const actorKeyMustExists = () => {
                if (!actorKey) throw new Error('Actor key not found');
            };

            return {
                actor: () => actor,
                steps: () => actor.steps,
                flows: () => actor.flows,
                hooks: () => actor.hooks,
                currentStep: () => PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.stepName),
                currentFlow: () => PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName),
                isStep(stepNameToTest, stepNameExpected) {
                    actorKeyMustExists();
                    return PREFIXED_NAME_BY_ACTOR(actorKey, stepNameToTest) === PREFIXED_NAME_BY_ACTOR(actorKey, stepNameExpected as string);
                },
                isSomeStep(stepNameToTest, stepNamesExpected) {
                    actorKeyMustExists();
                    return stepNamesExpected
                        .map((stepNameExpected) => PREFIXED_NAME_BY_ACTOR(actorKey, stepNameExpected as string))
                        .includes(PREFIXED_NAME_BY_ACTOR(actorKey, stepNameToTest));
                },
                isFlow(flowNameToTest, flowNameExpected) {
                    actorKeyMustExists();
                    return PREFIXED_NAME_BY_ACTOR(actorKey, flowNameToTest) === PREFIXED_NAME_BY_ACTOR(actorKey, flowNameExpected as string);
                },
                isSomeFlow(flowNameToTest, flowNamesExpected) {
                    actorKeyMustExists();
                    return flowNamesExpected
                        .map((flowNameExpected) => PREFIXED_NAME_BY_ACTOR(actorKey, flowNameExpected as string))
                        .includes(PREFIXED_NAME_BY_ACTOR(actorKey, flowNameToTest));
                },
                isCurrentActor(actorName) {
                    return actorKey === actorName;
                },
                isCurrentStep(stepName) {
                    return PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.stepName) === PREFIXED_NAME_BY_ACTOR(actorKey, stepName as string);
                },
                isCurrentFlow(flowName) {
                    return PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName) === PREFIXED_NAME_BY_ACTOR(actorKey, flowName as string);
                },
                asFlowName(flowName) {
                    actorKeyMustExists();
                    const prefixedFlowName = PREFIXED_NAME_BY_ACTOR(actorKey, flowName);
                    return Object.keys(actor.flows).includes(prefixedFlowName) ? prefixedFlowName : undefined;
                },
                asStepName(stepName) {
                    actorKeyMustExists();
                    const prefixedStepName = PREFIXED_NAME_BY_ACTOR(actorKey, stepName);
                    return Object.keys(actor.steps).includes(prefixedStepName) ? prefixedStepName : undefined;
                },
                startFlow(flowName, request, input, options) {
                    const { useNewTrail = false } = options || {};
                    let { crawlerMode, reference } = options || {};
                    actorKeyMustExists();

                    const flowNamePrefixed = PREFIXED_NAME_BY_ACTOR(actorKey, flowName);

                    const localTrail = useNewTrail ? Trail.create({ actor }) : currentTrail;

                    const flow = actor.flows?.[flowNamePrefixed] as FlowInstance<Extract<keyof S, string>>;
                    const stepName = flow?.steps?.[0];
                    const step = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, stepName)];

                    const currentFlow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data?.flowName)] as FlowInstance<Extract<keyof S, string>>;
                    if (currentFlow && !(currentFlow.flows || []).includes(UNPREFIXED_NAME_BY_ACTOR(flowName))) {
                        throw new Error(`Flow ${flowName} is not runnable from current flow ${currentFlow.name}`);
                    };

                    const inputCompleted = { ...(input || {}), flow: UNPREFIXED_NAME_BY_ACTOR(flowName) };

                    Model.validate(flow.input, inputCompleted, { throwError: true });

                    crawlerMode = crawlerMode || step?.crawlerMode || flow?.crawlerMode || actor?.crawlerMode;
                    reference = {
                        ...(currentMeta.data.reference || {}),
                        ...(reference || {}),
                        [TRAIL_KEY_PROP]: localTrail.id,
                    } as ModelReference<ReallyAny>;

                    const flowKey = Trail.setFlow(localTrail, {
                        name: flowNamePrefixed,
                        input: inputCompleted,
                        reference,
                        crawlerMode,
                        output: undefined,
                    });

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
                            flowStart: true,
                            flowName: flowNamePrefixed,
                            stepName,
                            crawlerMode,
                            reference: {
                                ...reference,
                                [FLOW_KEY_PROP]: flowKey,
                            },
                        },
                    );

                    const localIngested = Trail.ingested(localTrail);
                    TrailDataRequests.set(localIngested.requests, meta.request);
                    return meta.data.reference;
                },
                // pipe(flowName, request, input, options) {
                //     const { crawlerMode, reference } = options || {};
                //     return this.start(flowName, request, input, { crawlerMode, reference, useNewTrail: true });
                // },
                nextStep(stepName, request, reference, options) {
                    let { crawlerMode } = options || {};
                    actorKeyMustExists();

                    const flow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName)];
                    const step = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, stepName)];

                    crawlerMode = crawlerMode || step?.crawlerMode || flow?.crawlerMode || actor?.crawlerMode;

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
                            flowStart: false,
                            stepName,
                            crawlerMode: crawlerMode || step?.crawlerMode || actor?.crawlerMode,
                            reference: {
                                ...(reference || {}),
                                [TRAIL_KEY_PROP]: currentTrail.id,
                            },
                        },
                    );

                    TrailDataRequests.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
                stop() {
                    context.request.userData = RequestMeta.extend(currentMeta, { stepStop: true }).userData;
                },
                retry() {
                    throw new Error('Retry this step');
                },
            } as StepApiFlowsAPI<F, S, M>;
        },
    };
};

export default { create };
