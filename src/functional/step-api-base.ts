import { MakeStepBaseApiContext, StepBaseApiInstance, StepBaseApiOptions } from '../common/types';
import { resolveUrl } from '../common/utils';
import base from './base';
import requestMeta from './request-meta';

// eslint-disable-next-line max-len
export const create = <ModelDefinitions = unknown, Context extends MakeStepBaseApiContext = MakeStepBaseApiContext>(options: StepBaseApiOptions): StepBaseApiInstance<ModelDefinitions, Context> => {
    const {
        input,
        step,
        stores,
        datasets,
        queues,
    } = options || {};

    return {
        ...base.create({ key: 'step-base-api', name: 'step-base-api' }),
        handler(crawlingContext) {
            const meta = requestMeta.create(crawlingContext);
            const getTrailId = () => meta.data.trailId;

            // const trail = new Trail<ModelDefinitions>({
            //     id: getTrailId(),
            //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //     store: (stores as any)?.trails,
            //     models: models,
            // });

            // const modelMethods = Object.values(models.items).reduce((acc, model) => {
            //     acc = {
            //         ...acc,
            //         [`get${model.name}Reference`]: () => {
            //             return model.filterReference(meta.data.references);
            //         },
            //         [`add${model.name}`]: (value: any, ref?: References) => {
            //             // validate ref
            //             // validate data
            //             return trail.ingested[model.name].add(value, ref);
            //         },
            //         [`add${model.name}Partial`]: (value: Partial<any>, ref?: References) => {
            //             // validate ref
            //             // validate partial data
            //             return trail.ingested[model.name].add(value, ref);
            //         },
            //     };
            //     return acc;
            // }, {});

            const baseApi = {
                // step
                step,
                // main api
                stores,
                datasets,
                queues,
                // accessors
                getInput: () => input || {},

            };

            return {
                ...baseApi,
                // ...modelMethods,
            };
        },
    };
};
