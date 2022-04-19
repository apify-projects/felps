import { Queue, RequestMeta, Trail } from '.';
import base from './base';
import { ActorInstance, FlowNamesSignature, StepApiFlowsInstance } from './common/types';
// import TrailDataRequests from './trail-data-requests';

export const create = <
    FlowNames extends FlowNamesSignature = FlowNamesSignature
>(actor: ActorInstance): StepApiFlowsInstance<FlowNames> => {
    return {
        ...base.create({ key: 'step-api-flows', name: 'step-api-flows' }),
        handler(context) {
            return {
                start(flowName, request, reference) {
                    try {
                        const trail = Trail.createFrom(context?.request, { actor });
                        const ingest = Trail.ingested(trail);

                        const stepName = actor.flows?.[flowName]?.steps?.[0]?.name;

                        const meta = RequestMeta.extend(
                            RequestMeta.create(request),
                            { stepName, reference },
                        );

                        console.log(ingest.requests);

                        // TrailDataRequests.setRequest(ingest.requests, meta.request);
                        // return meta.data.reference;
                        // Run this in dispatcher instead
                        return Queue.add(actor.queues.default, meta.request);
                    } catch (error) {
                        console.error(error);
                    }
                    return {};
                },
            };
        },
    };
};

export default { create };
