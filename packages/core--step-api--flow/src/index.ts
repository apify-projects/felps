import mergeDeep from 'merge-deep';
import Model from '@usefelps/core--model';
import Trail from '@usefelps/core--trail';
import RequestMeta from '@usefelps/core--request-meta';
import Base from '@usefelps/core--instance-base';
import { FLOW_KEY_PROP, PREFIXED_NAME_BY_ACTOR, TRAIL_KEY_PROP, UNPREFIXED_NAME_BY_ACTOR } from '@usefelps/core--constants';
import TrailDataRequests from '@usefelps/core--trail--data-requests';
import {
    ActorInstance, FlowDefinition, FlowInstance, ModelDefinition,
    ModelReference, ReallyAny, StepApiFlowsAPI, StepApiFlowsInstance
} from '@usefelps/types';

export const create = <
    F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition>>(actor: ActorInstance): StepApiFlowsInstance<F, S, M> => {
    return {
        ...Base.create({ key: 'step-api-flows', name: 'step-api-flows' }),
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
                    const { useNewTrail = true } = options || {};
                    let { crawlerOptions, reference } = options || {};
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

                    crawlerOptions = mergeDeep(actor?.crawlerOptions || {}, flow?.crawlerOptions || {}, step?.crawlerOptions || {}, crawlerOptions || {});
                    reference = {
                        ...(currentMeta.data.reference || {}),
                        ...(reference || {}),
                        [TRAIL_KEY_PROP]: localTrail.id,
                    } as ModelReference<ReallyAny>;

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
                                [FLOW_KEY_PROP]: flowKey,
                            },
                        },
                    );

                    const localIngested = Trail.ingested(localTrail);
                    TrailDataRequests.set(localIngested.requests, meta.request);
                    return meta.data.reference;
                },
                paginateStep(request, reference, options) {
                    return this.nextStep(this.currentStep() as ReallyAny, request, reference, options);
                },
                nextStep(stepName, request, reference, options) {
                    let { crawlerOptions } = options || {};
                    actorKeyMustExists();

                    const flow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName)];
                    const step = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, stepName)];

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
                                [TRAIL_KEY_PROP]: currentTrail.id,
                            },
                        },
                    );

                    TrailDataRequests.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
                nextDefaultStep(request, reference, options) {
                    actorKeyMustExists();

                    const flow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, currentMeta.data.flowName)];
                    const currentStepIndex = (flow?.steps || []).findIndex((localStepName: string) => localStepName
                        === UNPREFIXED_NAME_BY_ACTOR(currentMeta.data.stepName),
                    );
                    const nextStepName = currentStepIndex > -1 ? flow.steps[currentStepIndex + 1] : undefined;

                    if (!nextStepName) {
                        throw new Error(`No default step found for flow ${flow.name}`);
                    }

                    return this.nextStep(nextStepName, request || { url: context.request.url, headers: context.request.headers }, reference, options);
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
