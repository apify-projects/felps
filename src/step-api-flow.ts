import { RequestMeta, Trail } from '.';
import base from './base';
import { ActorInstance, FlowNamesSignature, ModelSchemasSignature, StepApiFlowsInstance, StepNamesSignature } from './common/types';
import TrailDataRequests from './trail-data-requests';

export const create = <
    FlowNames extends FlowNamesSignature = FlowNamesSignature,
    StepNames extends StepNamesSignature = StepNamesSignature,
    ModelSchemas extends ModelSchemasSignature = ModelSchemasSignature,
    >(actor: ActorInstance): StepApiFlowsInstance<FlowNames, StepNames, ModelSchemas> => {
    return {
        ...base.create({ key: 'step-api-flows', name: 'step-api-flows' }),
        handler(context) {
            return {
                start(flowName, request, input, reference) {
                    const trail = Trail.createFrom(context?.request, { actor });
                    const ingest = Trail.ingested(trail);

                    Trail.update(trail, { input });

                    const flow = actor.flows?.[flowName];
                    const step = flow?.steps?.[0];

                    const meta = RequestMeta.extend(
                        RequestMeta.create(request),
                        {
                            stepName: step?.name,
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
                        {
                            stepName: step?.name,
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
            };
        },
    };
};

export default { create };
