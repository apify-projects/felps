import { RequestMeta, Trail } from '.';
import base from './base';
import { ActorInstance, ModelDefinition, StepApiFlowsAPI, StepApiFlowsInstance } from './types';
import TrailDataRequests from './trail-data-requests';

export const create = <F, S, M extends Record<string, ModelDefinition>>(actor: ActorInstance): StepApiFlowsInstance<F, S, M> => {
    return {
        ...base.create({ key: 'step-api-flows', name: 'step-api-flows' }),
        handler(context) {
            const currentMeta = RequestMeta.create(context);
            const trail = Trail.createFrom(context?.request, { actor });
            const ingest = Trail.ingested(trail);

            return {
                asFlowName(flowName) {
                    return Object.keys(actor.flows).includes(flowName) ? flowName : undefined;
                },
                start(flowName, request, input, reference, options) {
                    const { crawlerMode } = options || {};
                    Trail.update(trail, { input });

                    const flow = actor.flows?.[flowName];
                    const stepName = flow?.steps?.[0];
                    const step = actor.steps?.[stepName];

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
                            flowName,
                            stepName,
                            crawlerMode: crawlerMode || step?.crawlerMode || flow?.crawlerMode || actor?.crawlerMode,
                            reference: {
                                ...(reference || {}),
                                trailKey: trail.id,
                            },
                        },
                    );

                    TrailDataRequests.set(ingest.requests, meta.request);
                    return meta.data.reference;
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
                                trailKey: trail.id,
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
