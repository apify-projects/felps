import Base from './base';
import { MakeStepBaseApiContext, References, RequestContext, StepBaseRootMethods } from './common/types';
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

            const trail = new Trail<ModelDefinitions>({
                id: getTrailId(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                store: (context?.stores as any)?.trails,
                models: context?.models,
            });

            const modelMethods = Object.values(context?.models.items).reduce((acc, model) => {
                acc = {
                    ...acc,
                    [`get${model.name}Reference`]: () => {
                        return model.filterReference(meta.data.references);
                    },
                    [`add${model.name}`]: (value: any, ref?: References) => {
                        // validate ref
                        // validate data
                        return trail.ingested[model.name].add(value, ref);
                    },
                    [`add${model.name}Partial`]: (value: Partial<any>, ref?: References) => {
                        // validate ref
                        // validate partial data
                        return trail.ingested[model.name].add(value, ref);
                    },
                };
                return acc;
            }, {});

            const baseApi = {
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
                trail,
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

            return {
                ...baseApi,
                ...modelMethods,
            };
        }
    }
