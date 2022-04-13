import Base from './base';
import { MakeStepBaseApiContext, RequestContext, StepBaseRootMethods } from './common/types';
import { resolveUrl } from './common/utils';
import RequestMeta from './request-meta';
import Step from './step';
import Trail from './trail';

export default class StepBaseApi<ModelDefinitions = unknown, Context extends MakeStepBaseApiContext = MakeStepBaseApiContext> extends Base {
    constructor() {
        super({ key: 'step-base-api', name: 'step-base-api' });
    }

    use(step: Step, context: Context) {
        return (crawlingContext: RequestContext): StepBaseRootMethods<ModelDefinitions, Context> => {
            const meta = new RequestMeta().from(crawlingContext);
            const getTrailId = () => meta.data.trailId;

            return {
                // step
                uid: step.uid,
                name: step.name,
                id: step.id,
                // main api
                stores: context?.stores,
                datasets: context?.datasets,
                queues: context?.queues,
                // accessors
                getInput: () => context?.input || {},
                getStep: () => meta.data.step,
                getUserData: () => meta.userData,
                getReferences: () => meta.data.references,
                // trail
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                trail: new Trail<ModelDefinitions>({
                    id: getTrailId(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    store: (context?.stores as any)?.trails,
                    models: context?.models,
                }),
                // common
                log: this.log.cloneWithSuffix(getTrailId() ? `${getTrailId()}:${crawlingContext?.request?.id}` : ''),
                // utils
                absoluteUrl: (path: string) => resolveUrl(
                    path,
                    crawlingContext.request.loadedUrl !== 'about:blank'
                        ? crawlingContext.request.loadedUrl
                        : crawlingContext.request.url,
                ),
            };
        };
    }
}
