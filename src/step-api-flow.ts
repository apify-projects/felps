import { Model, RequestMeta, Trail } from '.';
import base from './base';
import { FLOW_KEY_PROP, PREFIXED_NAME_BY_ACTOR, TRAIL_KEY_PROP } from './consts';
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
                isStep(stepNameToTest, stepNameExpected) {
                    actorKeyMustExists();
                    return PREFIXED_NAME_BY_ACTOR(actorKey, stepNameToTest) === PREFIXED_NAME_BY_ACTOR(actorKey, stepNameExpected);
                },
                isFlow(flowNameToTest, flowNameExpected) {
                    actorKeyMustExists();
                    return PREFIXED_NAME_BY_ACTOR(actorKey, flowNameToTest) === PREFIXED_NAME_BY_ACTOR(actorKey, flowNameExpected);
                },
                isCurrentStep(stepName) {
                    return currentMeta.data.stepName === stepName;
                },
                isCurrentFlow(flowName) {
                    return currentMeta.data.flowName === flowName;
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
                start(flowName, request, input, options) {
                    let { crawlerMode, reference } = options || {};
                    actorKeyMustExists();

                    const localTrail = Trail.create({ actor });

                    const flow = actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, flowName)] as FlowInstance<Extract<keyof S, string>>;
                    const stepName = flow?.steps?.[0];
                    const step = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, stepName)];

                    Model.validate(flow.input, input, { throwError: true });

                    crawlerMode = crawlerMode || step?.crawlerMode || flow?.crawlerMode || actor?.crawlerMode;
                    reference = {
                        ...(reference || {}),
                        [TRAIL_KEY_PROP]: localTrail.id,
                    } as ModelReference<ReallyAny>;

                    const flowKey = Trail.setFlow(localTrail, {
                        name: flowName,
                        input,
                        reference,
                        crawlerMode,
                        output: undefined,
                    });

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
                            flowStart: true,
                            flowName,
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
                pipe(flowName, request, input, options) {
                    const { crawlerMode, reference } = options || {};
                    return this.start(flowName, request, input, { crawlerMode, reference, useNewTrail: true });
                },
                next(stepName, request, reference, options) {
                    const { crawlerMode } = options || {};
                    actorKeyMustExists();

                    const step = actor.steps?.[PREFIXED_NAME_BY_ACTOR(actorKey, stepName)];

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
                    // retry current flow
                },
            } as StepApiFlowsAPI<F, S, M>;
        },
    };
};

export default { create };
