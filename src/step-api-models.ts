import base from './base';
import { StepApiModelsAPI, StepApiModelsInstance } from './common/types';

// eslint-disable-next-line max-len
export const create = <ModelSchemas extends Record<string, unknown> = Record<string, unknown>>(): StepApiModelsInstance<ModelSchemas> => {
    return {
        ...base.create({ key: 'step-api-models', name: 'step-api-models' }),
        handler() {
            return {} as StepApiModelsAPI<ModelSchemas>;
        },
        // handler(crawlingContext) {
        //     const meta = new RequestMeta().from(crawlingContext);
        //     const getTrailId = () => meta.data.trailId;

        //     const trail = new Trail<ModelDefinitions>({
        //         id: getTrailId(),
        //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //         store: (context?.stores as any)?.trails,
        //         models: context?.models,
        //     });

        //     const modelMethods = Object.values(context?.models.items).reduce((acc, model) => {
        //         acc = {
        //             ...acc,
        //             [`get${model.name}Reference`]: () => {
        //                 return model.filterReference(meta.data.references);
        //             },
        //             [`add${model.name}`]: (value: any, ref?: ModelReference) => {
        //                 // validate ref
        //                 // validate data
        //                 return trail.ingested[model.name].add(value, ref);
        //             },
        //             [`add${model.name}Partial`]: (value: Partial<any>, ref?: ModelReference) => {
        //                 // validate ref
        //                 // validate partial data
        //                 return trail.ingested[model.name].add(value, ref);
        //             },
        //         };
        //         return acc;
        //     }, {});
        // }
    };
};

export default { create };
