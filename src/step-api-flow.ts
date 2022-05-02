import { Model, RequestMeta, Trail } from '.';
import base from './base';
import { FLOW_KEY_PROP, TRAIL_KEY_PROP } from './consts';
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

            return {
                isStep(stepName) {
                    return currentMeta.data.stepName === stepName;
                },
                isFlow(flowName) {
                    return currentMeta.data.flowName === flowName;
                },
                asFlowName(flowName) {
                    return Object.keys(actor.flows).includes(flowName) ? flowName : undefined;
                },
                asStepName(stepName) {
                    return Object.keys(actor.steps).includes(stepName) ? stepName : undefined;
                },
                start(flowName, request, input, options) {
                    const { useNewTrail = true } = options || {};
                    let { crawlerMode, reference } = options || {};

                    const localTrail = useNewTrail ? Trail.create({ actor }) : currentTrail;

                    const flow = actor.flows?.[flowName] as FlowInstance<Extract<keyof S, string>>;
                    const stepName = flow?.steps?.[0];
                    const step = actor.steps?.[stepName];

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
                            flowName,
                            stepName,
                            crawlerMode,
                            reference: {
                                ...reference,
                                [FLOW_KEY_PROP]: flowKey,
                            },
                        },
                    );

                    TrailDataRequests.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
                pipe(flowName, request, input, options) {
                    const { crawlerMode, reference } = options || {};
                    return this.start(flowName, request, input, { crawlerMode, reference, useNewTrail: true });
                },
                next(stepName, request, reference, options) {
                    const { crawlerMode } = options || {};
                    const step = actor.steps?.[stepName];

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
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
                    // stop current flow
                },
                retry() {
                    // retry current flow
                },
            } as StepApiFlowsAPI<F, S, M>;
        },
    };
};

export default { create };
