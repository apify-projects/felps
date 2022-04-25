import { RequestMeta, Trail } from '.';
import base from './base';
import { ActorInstance, ModelDefinition, StepApiFlowsAPI, StepApiFlowsInstance } from './types';
import TrailDataRequests from './trail-data-requests';

export const create = <F, S, M extends Record<string, ModelDefinition>>(actor: ActorInstance): StepApiFlowsInstance<F, S, M> => {
    return {
        ...base.create({ key: 'step-api-flows', name: 'step-api-flows' }),
        handler(context) {
            const currentMeta = RequestMeta.create(context);

            return {
                start(flowName, request, input, reference) {
                    const trail = Trail.createFrom(context?.request, { actor });
                    const ingest = Trail.ingested(trail);

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
                            crawlerMode: step?.crawlerMode || flow?.crawlerMode || actor?.crawlerMode,
                            reference: {
                                ...(reference || {}),
                                trailKey: trail.id,
                            },
                        },
                    );

                    TrailDataRequests.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
                goto(stepName, request, reference) {
                    const trail = Trail.createFrom(context?.request, { actor });
                    const ingest = Trail.ingested(trail);

                    const step = actor.steps?.[stepName];

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        currentMeta.data,
                        {
                            stepName,
                            crawlerMode: step?.crawlerMode || actor?.crawlerMode,
                            reference: {
                                ...(reference || {}),
                                trailKey: trail.id,
                            },
                        },
                    );

                    TrailDataRequests.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
            } as StepApiFlowsAPI<F, S, M>;
        },
    };
};

export default { create };
