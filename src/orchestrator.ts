import Base from './base';
import { MakeStepBaseApiContext, OrchestratorOptions, RequestContext } from './common/types';

export default class Orchestrator<Methods = MakeStepBaseApiContext> extends Base {
    constructor(options?: OrchestratorOptions) {
        const { name = 'default' } = options || {};
        super({ key: 'orchestrator', name });
    }

    use() {
        return (crawlingContext: RequestContext, api: Methods) => {
            const hasAnyRequests = false;
            const hasAllCompleted = true;

            // process models
            // pursue all requests
            // return all results
        };
    }
}
