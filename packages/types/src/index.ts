/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify, { Request } from 'apify';
import { ApifyClient } from 'apify-client';
import type { LogLevel } from 'apify/build/utils_log';
import type EventEmitter from 'eventemitter3';
import type { IndexOptions, IndexOptionsForDocumentSearch } from 'flexsearch';
import type { JSONSchema7 as $JSONSchema7 } from 'json-schema';
import type { FromSchema } from 'json-schema-to-ts';
import type { Readonly } from 'json-schema-to-ts/lib/utils';
import type Queue from 'queue';
import type Route from 'route-parser';
// import MultiCrawler from './sdk/multi-crawler';
// import RequestQueue from './sdk/request-queue';

export type { JSONSchemaType } from 'ajv';

export type MakeSchema<S> = S | Readonly<S>;
export type JSONSchema = MakeSchema<_JSONSchema7>;
export type JSONSchemaWithMethods = MakeSchema<_JSONSchema7<JSONSchemaMethods>>;
export type JSONSchemaMethods = {
    resolveList?: (ref: ModelReference, methods: { getEntities: (modelName: string, ref?: ModelReference) => TrailDataModelItem[]; }) => TrailDataModelItem[],
    organizeList?: (items: TrailDataModelItem<ReallyAny>[], api: GeneralStepApi) => TrailDataModelItem[] | Promise<TrailDataModelItem[]>,
    isListComplete?: (items: TrailDataModelItem[], api: GeneralStepApi) => boolean | Promise<boolean>,
    isItemMatch?: (existingItem: TrailDataModelItem<ReallyAny>, newItem: TrailDataModelItem<ReallyAny>) => boolean,
};

export type JSONSchemaObject<T = unknown> =
    (Omit<$JSONSchema7, 'const' | 'enum' | 'items' | 'additionalItems' | 'contains' |
        'properties' | 'patternProperties' | 'additionalProperties' | 'dependencies' |
        'propertyNames' | 'if' | 'then' | 'else' | 'allOf' | 'anyOf' | 'oneOf' | 'not' |
        'definitions' | 'examples'> & {
            const?: unknown;
            enum?: unknown;
            items?: _JSONSchema7<T> | _JSONSchema7<T>[];
            additionalItems?: _JSONSchema7<T>;
            contains?: _JSONSchema7<T>;
            properties?: Record<string, _JSONSchema7<T>>;
            patternProperties?: Record<string, _JSONSchema7<T>>;
            additionalProperties?: _JSONSchema7<T>;
            dependencies?: {
                [key: string]: _JSONSchema7<T> | string[];
            };
            propertyNames?: _JSONSchema7<T>;
            if?: _JSONSchema7<T>;
            then?: _JSONSchema7<T>;
            else?: _JSONSchema7<T>;
            allOf?: _JSONSchema7<T>[];
            anyOf?: _JSONSchema7<T>[];
            oneOf?: _JSONSchema7<T>[];
            not?: _JSONSchema7<T>;
            nullable?: boolean;
            definitions?: {
                [key: string]: _JSONSchema7<T>;
            };
            examples?: unknown[];
        } & {
            modelName?: string;
        } & T)

export type _JSONSchema7<T = unknown> = boolean | JSONSchemaObject<T>;

export type Self<T> = T;
export type AnyObject = Record<string, ReallyAny>;
export type ReallyAny = any;
export type UniqueyKey = string;
export type ReferenceKey = string;

export type ArrayElementType<T> = T extends (infer E)[] ? E : T;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export type SnakeToCamelCase<S extends string> =
    S extends `${infer T}_${infer U}` ?
    `${Lowercase<T>}${Capitalize<SnakeToCamelCase<Lowercase<U>>>}` :
    Lowercase<S>;

export type SnakeToPascalCase<S extends string> =
    S extends `${infer T}_${infer U}` ?
    `${Capitalize<Lowercase<T>>}${SnakeToPascalCase<Capitalize<Lowercase<U>>>}` :
    Capitalize<Lowercase<S>>;

export type WithoutFunctions<T> = {
    [K in keyof T]: T[K] extends (string | number) ? K : never
};

export type Primitives = bigint | boolean | null | number | string | symbol | undefined
export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
export type GeneralKeyedObject<N extends Record<string, string>, T> = { [K in Extract<keyof N, string>]: T };
export type GenerateObject<N extends string[], T> = { [K in N[number]]: T };
export type ValueOf<T> = T[keyof T];

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExtractSchemaModelNames<N> = N extends (ReadonlyArray<ReallyAny> | Array<ReallyAny> | Function) ? never :
    (N extends object ?
        (N extends { modelName: infer MN }
            ? Extract<MN, string> | ExtractSchemaModelNames<Omit<N, 'modelName'>>
            : { [K in keyof N]: ExtractSchemaModelNames<N[K]> }[keyof N])
        : never);

export type ExtractFlowsSchemaModelNames<F extends Record<string, FlowDefinition<ReallyAny>>> = {
    [K in keyof F]: ExtractSchemaModelNames<F[K]['output']['schema']>
}[keyof F];

type DeepModelsOmitter<V> = V extends { modelName: string }
    ? never : (V extends Record<string, any> ? { [K in keyof V]: DeepModelsOmitter<V[K]> } : V);

type DeepOmitModels<T> = {
    [K in keyof T]: DeepModelsOmitter<T[K]>
}

type ExcludeKeysWithTypeOf<T, V> = Pick<T, { [K in keyof T]: Exclude<T[K], undefined> extends V ? never : K }[keyof T]>;

export type ExtractFlowsWithStep<
    StepName extends string,
    S,
    F extends Record<string, FlowDefinition<keyof S>>
> = ExcludeKeysWithTypeOf<{
    [K in keyof F]: StepName extends F[K]['steps'][number] ? F[K] : 'not this'
}, 'not this'>;

// apify --------------------------------------------------
export type RequestSource = import('apify').Request | import('apify').RequestOptions
export type RequestOptionalOptions = { priority?: number, crawlerOptions?: RequestCrawlerOptions, forefront?: boolean | undefined } | undefined
export type RequestContext = Apify.CheerioHandlePageInputs & Apify.PlaywrightHandlePageFunctionParam & Apify.BrowserCrawlingContext & Apify.CrawlingContext

// base.ts ------------------------------------------------------------
export type BaseInstance = {
    uid?: string,
    key?: string,
    name: string,
    id: string,
};

export type BaseOptions = {
    name?: string,
    key?: string,
    uid?: string,
    id?: string,
}

// flows.ts ------------------------------------------------------------
export type FlowsInstance<StepNames = string> = Record<string, FlowInstance<StepNames>>;
export type FlowDefinitions<StepNames = string> = Record<string, FlowDefinition<StepNames>>;

// flow.ts ------------------------------------------------------------
export type FlowInstance<StepNames> = {
    crawlerOptions?: RequestCrawlerOptions,
    steps: StepNames[] | readonly Readonly<StepNames>[],
    flows: string[] | readonly Readonly<string>[],
    input: ModelInstance<JSONSchema>,
    output: ModelInstance<JSONSchema>,
    actorKey?: UniqueyKey | undefined,
} & BaseInstance;

export type FlowDefinitionRaw<StepNames = string> = {
    name?: string,
    crawlerOptions?: RequestCrawlerOptions,
    steps: StepNames[],
    flows?: string[],
    input: ModelDefinition<JSONSchemaWithMethods>,
    output: ModelDefinition<JSONSchemaWithMethods>,
    actorKey?: UniqueyKey,
};

export type FlowDefinition<StepNames = string> = FlowDefinitionRaw<StepNames> | Readonly<FlowDefinitionRaw<StepNames>>;

export type FlowNamesObject<F extends Record<string, ReallyAny>> = {
    [K in keyof F]: Extract<K, string>
}

export type FlowOptions<StepNames = string> = FlowDefinition<StepNames> & { name: string }

export type FlowOptionsWithoutName<StepNames = string> = Omit<FlowOptions<StepNames>, 'name'>;

// steps.ts ------------------------------------------------------------
// eslint-disable-next-line max-len
export type StepCollectionInstance<M extends Record<string, ModelDefinition>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition> = {
    [StepName in Extract<keyof S, string>]: StepInstance<StepApiInstance<F, S, M, I, StepName>> &
    Omit<S[StepName], 'handler' | 'errorHandler' | 'requestErrorHandler' | 'afterHandler' | 'beforeHandler'>
};

export type StepCollectionOptions<T> = {
    STEPS?: T
}

export type StepDefinitions<T extends Record<string, StepDefinition>> = {
    [K in keyof T]: T[K] extends StepDefinition ? {
        crawlerOptions: T[K]['crawlerOptions'],
    } : never
};

export type StepDefinition<Methods = unknown> = Partial<Pick<StepInstance<Methods & GeneralStepApi>, 'crawlerOptions'>>

export type StepNamesSignature = Record<string, string>

// step.ts ------------------------------------------------------------
export type StepInstance<Methods = unknown> = {
    name: string,
    crawlerOptions?: RequestCrawlerOptions,
    handler?: StepOptionsHandler<Methods & GeneralStepApi>,
    errorHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    requestErrorHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    afterHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    beforeHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    actorKey?: string,
} & BaseInstance;

export type StepOptions<Methods = unknown> = {
    name: string,
    crawlerOptions?: RequestCrawlerOptions,
    handler?: StepOptionsHandler<Methods & GeneralStepApi>,
    errorHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    requestErrorHandler?: StepOptionsHandler<Methods & GeneralStepApi>
    afterHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    beforeHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    actorKey?: string,
}

export type StepOptionsHandler<Methods = unknown> = (context: RequestContext, api: Methods) => Promise<void>

// step-api.ts -----------------------------------------------------------------
export type StepApiInstance<
    F extends Record<string, FlowDefinition<keyof S>>,
    S,
    M extends Record<string, ModelDefinition>,
    I extends InputDefinition,
    StepName extends string = 'NO_STEPNAME'
> = GeneralStepApi<I>
    & StepApiFlowsAPI<F, S, M>
    & StepApiModelAPI<M, S, F, StepName>;

export type GeneralStepApi<I extends InputDefinition = InputDefinition> = StepApiMetaAPI<I> & StepApiHelpersAPI;

export type StepApiOptions = {
    extend?: (context: RequestContext, api: ReallyAny, actor: ActorInstance) => Record<string, ReallyAny>
}

// step-api-flow.ts ------------------------------------------------------------
export type StepApiFlowsInstance<F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition>> = {
    handler: (context: RequestContext) => StepApiFlowsAPI<F, S, M>,
};

export type StepApiFlowsAPI<F extends Record<string, FlowDefinition<keyof S>>, S, M> = {
    actor(): ActorInstance,
    flows(): Record<string, FlowInstance<ReallyAny>>,
    hooks(): Record<string, StepInstance>,
    steps(): Record<string, StepInstance>,
    currentStep(): string,
    currentFlow(): string,
    isCurrentStep: (stepName: keyof S) => boolean,
    isCurrentFlow: (flowName: keyof F) => boolean,
    isCurrentActor: (actorKey: string) => boolean,
    isStep: (stepNameToTest: string, stepNameExpected: keyof S) => boolean,
    isFlow: (flowNameToTest: string, flowNameExpected: keyof F) => boolean,
    isSomeStep: (stepNameToTest: string, stepNamesExpected: (keyof S)[]) => boolean,
    isSomeFlow: (flowNameToTest: string, flowNamesExpected: (keyof F)[]) => boolean,
    asFlowName: (flowName: string) => (string | undefined), // | Extract<keyof F, string>
    asStepName: (stepName: string) => (string | undefined), // | Extract<keyof S, string>
    startFlow: <FlowName extends keyof F>(
        flowName: Extract<FlowName, string>,
        request: RequestSource,
        input?: ReallyAny, // FromSchema<F[FlowName]['input']>
        options?: {
            reference?: ModelReference<ReallyAny>,
            crawlerOptions?: RequestCrawlerOptions | undefined,
            stepName?: string, // Extract<keyof F[FlowName]['steps'], string>
            useNewTrail?: boolean
        }
    ) => ModelReference<M>;
    paginateStep: (request: RequestSource, reference?: ModelReference<M>, options?: { crawlerOptions?: RequestCrawlerOptions })
        => void;
    nextStep: (stepName: Extract<keyof S, string>, request: RequestSource, reference?: ModelReference<M>, options?: { crawlerOptions?: RequestCrawlerOptions })
        => void;
    nextDefaultStep: (request?: RequestSource, reference?: ModelReference<M>, options?: { crawlerOptions?: RequestCrawlerOptions }) => void;
    stop: (reference?: ModelReference<M>) => void;
    retry: (reference?: ModelReference<M>) => void;
};

// step-api-model.ts ------------------------------------------------------------
export type StepApiModelInstance<M extends Record<string, ModelDefinition>> = {
    handler: (context: RequestContext) => StepApiModelAPI<M>,
};

export type KeyedSchemaType<TModels extends Record<string, ModelDefinition>> = {
    [TModelName in keyof TModels]: {
        schema: FromSchema<TModels[TModelName]['schema']>
    }
}

// export type StepApiModelByFlowAPI<
//     M extends Record<string, ModelDefinition>,
//     N extends Record<string, ReallyAny> = KeyedSchemaType<M>,
//     AvailableModelNames = ExtractSchemaModelNames<M['output']>,
//     > = {
//         add: <ModelName extends AvailableModelNames>(
//             modelName: ModelName,
//             value: ModelName extends keyof N ? N[ModelName]['schema'] : never,
//             ref?: ModelReference<M>,
//         ) => ModelReference<M>;
//         addPartial: <ModelName extends AvailableModelNames>(
//             modelName: ModelName,
//             value: ModelName extends keyof N ? Partial<N[ModelName]['schema']> : never,
//             ref?: ModelReference<M>,
//         ) => ModelReference<M>;
//         get: <ModelName extends AvailableModelNames>(
//             modelName: ModelName,
//             ref?: ModelReference<M>,
//         ) => ModelName extends keyof N ? N[ModelName]['schema'] : never;
//         update: <ModelName extends AvailableModelNames>
//             // eslint-disable-next-line max-len
//             (
//             modelName: ModelName,
//             value: ModelName extends keyof N ? (
//                 Partial<N[ModelName]['schema']> | ((previous: Partial<N[ModelName]['schema']>
//                 ) => Partial<N[ModelName]['schema']>)) : never,
//             ref?: ModelReference<M>,
//         ) => ModelReference<M>;
//         updatePartial: <ModelName extends AvailableModelNames>
//             // eslint-disable-next-line max-len
//             (
//             modelName: ModelName,
//             value: ModelName extends keyof N ? (
//                 Partial<N[ModelName]['schema']> | ((previous: Partial<N[ModelName]['schema']>
//                 ) => Partial<N[ModelName]['schema']>)) : never,
//             ref?: ModelReference<M>,
//         ) => ModelReference<M>;
//     };

export type StepApiModelAPI<
    M extends Record<string, ModelDefinition>,
    S = 'NO_STEPS',
    F extends Record<string, FlowDefinition<keyof S>> = Record<string, never>,
    StepName extends string = 'NO_STEPNAME',
    AvailableFlows = StepName extends 'NO_STEPNAME' ? F : ExtractFlowsWithStep<StepName, S, F>,
    // eslint-disable-next-line max-len
    AvailableModelNames = StepName extends 'NO_STEPNAME' ? (AvailableFlows extends Record<string, FlowDefinition<keyof S>> ? ExtractFlowsSchemaModelNames<AvailableFlows> : keyof M) : keyof M,
    AvailableFlowNames = AvailableFlows extends Record<string, FlowDefinition<keyof S>> ? keyof AvailableFlows : keyof F,
    N extends Record<string, ReallyAny> = KeyedSchemaType<M>,
> = StepApiModelByFlowAPI<N, AvailableModelNames> & {
    inFlow: <
        FlowName extends AvailableFlowNames,
        // eslint-disable-next-line max-len
        FlowAvailableModelNames = AvailableFlows extends Record<string, FlowDefinition<keyof S>> ? (FlowName extends keyof AvailableFlows ? ExtractSchemaModelNames<AvailableFlows[FlowName]['output']['schema']> : keyof M) : keyof M,
    > (flowName: FlowName) => StepApiModelByFlowAPI<N, FlowAvailableModelNames>,
};

export type StepApiModelByFlowAPI<
    M extends Record<string, ModelDefinition>,
    AvailableModelNames = keyof M,
> = {
    get: <ModelName extends AvailableModelNames>(
        modelName: Extract<ModelName, string>,
        ref?: ModelReference<M>,
    ) => ModelName extends keyof M ? TrailDataModelItem : never;
    set: <ModelName extends AvailableModelNames>(
        modelName: Extract<ModelName, string>,
        value: ModelName extends keyof M ? DeepOmitModels<M[ModelName]['schema']> : never,
        ref?: ModelReference<M>,
    ) => ModelReference<M>;
    setPartial: <ModelName extends AvailableModelNames>(
        modelName: Extract<ModelName, string>,
        value?: ModelName extends keyof M ? DeepPartial<DeepOmitModels<M[ModelName]['schema']>> : never,
        ref?: ModelReference<M>,
    ) => ModelReference<M>;
    upsert: <ModelName extends AvailableModelNames, ModelSchema = ModelName extends keyof M ? DeepOmitModels<M[ModelName]['schema']> : never>(
        modelName: Extract<ModelName, string>,
        value: ModelName extends keyof M ? (
            ModelSchema | ((previous: DeepPartial<ModelSchema>
            ) => ModelSchema)) : never,
        ref?: ModelReference<M>,
    ) => ModelReference<M>;
    upsertPartial: <ModelName extends AvailableModelNames, ModelSchema = ModelName extends keyof M ? DeepOmitModels<M[ModelName]['schema']> : never>(
        modelName: Extract<ModelName, string>,
        value?: ModelName extends keyof M ? (
            DeepPartial<ModelSchema> | ((previous: DeepPartial<ModelSchema>
            ) => DeepPartial<ModelSchema>)) : never,
        ref?: ModelReference<M>,
    ) => ModelReference<M>;
    update: <ModelName extends AvailableModelNames, ModelSchema = ModelName extends keyof M ? DeepOmitModels<M[ModelName]['schema']> : never>(
        modelName: Extract<ModelName, string>,
        value: ModelName extends keyof M ? (
            ModelSchema | ((previous: DeepPartial<ModelSchema>
            ) => ModelSchema)) : never,
        ref?: ModelReference<M>,
    ) => ModelReference<M>;
    updatePartial: <ModelName extends AvailableModelNames, ModelSchema = ModelName extends keyof M ? DeepOmitModels<M[ModelName]['schema']> : never>(
        modelName: Extract<ModelName, string>,
        value: ModelName extends keyof M ? (
            DeepPartial<ModelSchema> | ((previous: DeepPartial<ModelSchema>
            ) => DeepPartial<ModelSchema>)) : never,
        ref?: ModelReference<M>,
    ) => ModelReference<M>;
    getInputModelName: () => string | undefined;
    getOutputModelName: () => string | undefined;
}

// step-api-meta.ts ------------------------------------------------------------
export type StepApiMetaInstance = {
    handler: (context: RequestContext) => StepApiMetaAPI,
};

export type StepApiMetaAPI<I extends InputDefinition = InputDefinition> = {
    getActorName: () => string | undefined;
    getActorInput: () => ReallyAny | FromSchema<I['schema']>;
    getUserData: () => Record<string, unknown>,
    getMetaData: () => RequestMetaData,
    getReference: () => RequestMetaData['reference'],
    getFlowInput: () => TrailFlowState['input'];
    getFlowName: () => string;
    getStepName: () => string;
}

// step-api-utils.ts ------------------------------------------------------------
export type StepApiHelpersInstance = {
    handler: (context: RequestContext) => StepApiHelpersAPI,
};

export type StepApiHelpersAPI = {
    absoluteUrl: (url: string) => string | undefined,
}

// models.ts ------------------------------------------------------------
export type ModelsInstance<T> = T;

export type ModelDefinitions<T extends Record<string, ModelDefinition>> = T
// model.ts ------------------------------------------------------------
export type ModelInstance<TSchema = JSONSchema> = ModelDefinition<TSchema> & BaseInstance;

export type ModelDefinition<TSchema = JSONSchema> = {
    name?: string,
    schema: TSchema,
    parentType?: string,
    parentPath?: string,
    parents?: string[],
}

export type ModelOptions<TSchema = JSONSchema> = ModelDefinition<TSchema>;

export type ModelReference<T = unknown> = Partial<{
    [K in Extract<keyof T, string> as `${SnakeToCamelCase<K>}Key`]: UniqueyKey;
} & {
    fRequestKey: UniqueyKey,
    fTrailKey: UniqueyKey,
    fFlowKey: UniqueyKey,
    fActorKey: UniqueyKey,
}>;

// stores.ts ------------------------------------------------------------
// eslint-disable-next-line max-len
export type StoreCollectionInstance<DataStoreNames extends string[] = DefaultDataStoreNames, FileStoreNames extends string[] = DefaultFileStoreNames> = GenerateObject<FileStoreNames & DefaultFileStoreNames, FileStoreInstance> & GenerateObject<DataStoreNames & DefaultDataStoreNames, DataStoreInstance>;

export type StoreInstance = DataStoreInstance | FileStoreInstance;

export type DefaultDataStoreNames = ['state', 'trails', 'incorrectDataset']
export type DefaultFileStoreNames = ['cachedRequests', 'files', 'responseBodies', 'browserTraces']

export type StoreCollectionOptions = {
    dataStores?: DataStoreOptions[],
    fileStores?: FileStoreOptions[],
    // dataStoreNames?: Extract<ValueOf<DataStoreNames>, string>[],
    // fileStoreNames?: Extract<ValueOf<FileStoreNames>, string>[],
    dataStoreAdapter?: KVStoreAdapterInstance,
    fileStoreAdapter?: KVStoreAdapterInstance,
}

export type StorageStatistics = {
    reads: number,
    writes: number
}

// data-store.ts ------------------------------------------------------------
export type DataStoreInstance = {
    type: 'data-store',
    adapter: KVStoreAdapterInstance,
    kvKey: string;
    pathPrefix: string;
    splitByKey?: boolean,
    initialized: boolean;
    state: Record<string, unknown>;
    stats: StorageStatistics;
} & BaseInstance;

export type DataStoreOptions = {
    adapter: KVStoreAdapterInstance,
    name: string,
    key?: string,
    kvKey?: string,
    splitByKey?: boolean,
    pathPrefix?: string,
}

// file-store.ts ------------------------------------------------------------
export type FileStoreInstance = {
    type: 'file-store',
    kvKey: string,
    resource: Apify.KeyValueStore | undefined,
    initialized: boolean,
    stats: StorageStatistics;
} & BaseInstance;

export type FileStoreOptions = {
    name: string,
    kvKey?: string,
    key?: string,
}

// trail.ts ------------------------------------------------------------
export type TrailInstance = {
    id: string;
    store: DataStoreInstance;
    models: ModelsInstance<ReallyAny>;
};

export type TrailOptions = {
    id?: string;
    actor?: ActorInstance;
}

export type TrailFlowState = {
    name: string,
    input: any,
    reference: ModelReference<ReallyAny> | undefined,
    crawlerOptions?: RequestCrawlerOptions,
    output?: any,
}

export type TrailState = {
    id: string,
    flows: {
        [flowKey: string]: TrailFlowState,
    },
    stats: {
        startedAt: string,
        endedAt: string,
        retries: number,
        sizeInKb: number,
        aggregatedDurationInMs: number,
    },
    ingested: TrailDataStage,
    digested: TrailDataStage,
    output: any,
}

// export type TrailInOutMethodsOptions<ModelSchemas> = {
//     name: string;
//     path: TrailDataStages;
//     store: DataStore;
//     methods: GenerateObject<keyof ModelSchemas, TrailInOutMethods>,
//     model: Model,
// }

// trails.ts
export type TrailsOptions = {
    actor: ActorInstance,
    store?: DataStoreInstance,
};

export type TrailsInstance = {
    actor: ActorInstance,
    store: DataStoreInstance,
} & BaseInstance;

// trail-data.ts
export type TrailDataStages = 'digested' | 'ingested';

export type TrailDataStage = {
    models: Record<string, TrailDataModelInstance>,
    requests: TrailDataRequestsInstance,
}

export type TrailDataInstance = TrailDataModelInstance | TrailDataRequestsInstance;

// trail-data-requests.ts
export type TrailDataRequestsInstance = {
    id: UniqueyKey,
    referenceKey: ReferenceKey;
    store: DataStoreInstance;
    path: string;
} & BaseInstance;

export type TrailDataRequestsOptions = {
    id: UniqueyKey,
    type: TrailDataStages,
    store: DataStoreInstance;
}

export type TrailDataRequestItemStatus = 'CREATED' | 'DISCARDED' | 'QUEUED' | 'STARTED' | 'SUCCEEDED' | 'FAILED';
export type TrailDataModelItemStatus = 'CREATED' | 'PUSHED' | 'DISCARDED';

export type TrailDataRequestItem = {
    id: UniqueyKey,
    source: RequestSource,
    snapshot: RequestSource | undefined,
    status: TrailDataRequestItemStatus,
}

// trail-data-model.ts ------------------------------------------------------------
export type TrailDataModelInstance = {
    referenceKey: ReferenceKey;
    id: UniqueyKey,
    path: string;
    model: ModelInstance;
    store: DataStoreInstance;
} & BaseInstance;

export type TrailDataModelOptions = {
    id: UniqueyKey,
    type: TrailDataStages,
    model: ModelInstance,
    store: DataStoreInstance,
}

export type TrailDataModelItem<T = unknown> = {
    id: UniqueyKey,
    model: string,
    reference: ModelReference<T>,
    data: Partial<T>,
    partial: boolean,
    operations: TrailDataModelOperation[],
    status: TrailDataModelItemStatus,
}

export type TrailDataModelOperation = {
    data: any,
    op: 'SET' | 'SET_PARTIAL' | 'UPDATE' | 'UPDATE_PARTIAL',
    at: string,
}

export type TrailDataModels = {
    [modelName: string]: {
        [key: string]: TrailDataModelItem,
    },
}

export type TrailModelPathsOptions = {
    name: string;
    path: TrailDataStages;
}

// queue.ts ------------------------------------------------------------
export type QueueInstance = {
    resource?: ReallyAny, // RequestQueue
} & BaseInstance;

export type QueueOptions = {
    name?: string,
}

// queues.ts ------------------------------------------------------------
export type QueueCollectionInstance<Names extends string[] = []> = GenerateObject<Names | DefaultQueueNames, StepInstance>;

export type QueueCollectionOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

export type DefaultQueueNames = ['default'];

// dataset.ts ------------------------------------------------------------
export type DatasetInstance = {
    name: string;
    resource: Apify.Dataset | undefined;
    events: EventsInstance;
} & BaseInstance;

export type DatasetOptions = {
    name?: string,
}

// datasets.ts ------------------------------------------------------------
export type DatasetCollectionInstance<Names extends string[] = []> = GenerateObject<Names | DefaultDatasetNames, DatasetInstance>;

export type DatasetCollectionOptions<Names extends string[] = []> = {
    names?: Names,
};

export type DefaultDatasetNames = ['default'];

// actor.ts ------------------------------------------------------------
export type ActorInstance = {
    name: string,
    crawlerOptions?: RequestCrawlerOptions,
    input: InputInstance,
    crawler: CrawlerInstance,
    steps: ReallyAny;
    stepApiOptions: StepApiOptions,
    // steps: StepCollectionInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
    flows: ReallyAny;
    // flows: FlowsInstance<ReallyAny>;
    models: ReallyAny;
    // models: ModelsInstance<ReallyAny>;
    stores: StoreCollectionInstance;
    queues: QueueCollectionInstance;
    datasets: DatasetCollectionInstance;
    hooks: ReallyAny;
    // hooks: HooksInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
} & BaseInstance;

export type ActorOptions = {
    name: string,
    input?: InputInstance,
    crawlerOptions?: RequestCrawlerOptions,
    crawler?: CrawlerInstance,
    steps?: ReallyAny;
    stepApiOptions?: StepApiOptions,
    // steps?: StepCollectionInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
    flows?: ReallyAny;
    // flows?: FlowsInstance<ReallyAny>;
    models?: ReallyAny;
    // models?: ModelsInstance<ReallyAny>;
    stores?: StoreCollectionInstance;
    queues?: QueueCollectionInstance;
    datasets?: DatasetCollectionInstance;
    hooks?: ReallyAny;
    // hooks?: HooksInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
}

export type ActorInput = string | {
    [x: string]: any;
} | Buffer | null;

// hooks.ts ------------------------------------------------------------
export type HooksInstance<M extends Record<string, ModelDefinition>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition> = {
    [K in DefaultHookNames[number]]: StepInstance<StepApiInstance<F, S, M, I>>;
};

export type DefaultHookNames = ['FLOW_STARTED', 'FLOW_ENDED', 'STEP_STARTED', 'STEP_ENDED', 'STEP_FAILED', 'STEP_REQUEST_FAILED',
    'ACTOR_STARTED', 'ACTOR_ENDED', 'QUEUE_STARTED', 'QUEUE_ENDED', 'PRE_NAVIGATION'];

export type GenerateHookFireMethods<T extends string[]> = {
    [K in T[number]as `fire${SnakeToPascalCase<K>}`]: (request: RequestSource) => void;
};

export type HookMethods = GenerateHookFireMethods<DefaultHookNames>;

// request-meta.ts ------------------------------------------------------------
export type RequestMetaInstance = {
    request: Request | RequestSource,
    userData: Record<string, unknown>,
    data: RequestMetaData,
} & BaseInstance;

export type RequestMetaOptions = {
    nothing?: string,
}

export type RequestCrawlerMode = 'http' | 'chromium' | 'firefox' | 'webkit';
export type RequestCrawlerOptions = {
    mode: RequestCrawlerMode
};

export type RequestMetaData = {
    isHook: boolean,
    stepStop: boolean,
    flowStop: boolean,
    flowStart: boolean,
    flowName: string,
    stepName: string,
    crawlerOptions?: RequestCrawlerOptions,
    reference: Partial<ModelReference<any>>,
}

// crawler.ts ------------------------------------------------------------
export type CrawlerInstance = {
    launcher?: ReallyAny, // MultiCrawler |
    resource: undefined, // MultiCrawler |
    events: EventsInstance,
} & BaseInstance;

export type CrawlerOptions = {
    launcher?: ReallyAny, //  MultiCrawler |
}

// logger.ts ------------------------------------------------------------
export type LoggerOptions = {
    suffix?: string,
    level?: LogLevel,
}

export type LogMethods = 'info' | 'warning' | 'error' | 'debug' | 'perf';

export type LoggerInstance = {
    elementId: string,
    suffix?: string,
    level?: LogLevel,
    apifyLogger: import('@apify/log/log').Log,
}

// apify-client.ts ------------------------------------------------------------
export type ApifyClientInstance = {
    resource: ApifyClient,
};

export type ApifyClientOptions = {
    token?: string,
};

// dispatcher.ts ------------------------------------------------------------
export type OrchestratorInstance = {
    handler: (context: RequestContext, api: unknown) => Promise<void>,
}

// validator.ts ------------------------------------------------------------
export type ValidatorInstance = {
    name: string,
    schema: JSONSchema,
};

export type ValidatorOptions = {
    name: string,
    schema: JSONSchema,
};

export type ValidatorValidateOptions = {
    logError?: boolean,
    throwError?: boolean,
    partial?: boolean,
};

// input.ts ------------------------------------------------------------
export type InputInstance<TSchema extends JSONSchema = { type: 'object' }> = {
    data: ReallyAny | undefined, // FromSchema<TSchema>
    schema: TSchema,
};

export type InputDefinition<TSchema extends JSONSchema = { type: 'object' }> = {
    schema: TSchema,
};

// search.ts ------------------------------------------------------------
export type SearchInstance = {
    indexOptions: IndexOptions<string, false>,
    documentOptions: IndexOptionsForDocumentSearch<unknown, false>,
} & BaseInstance;

export type SearchOptions = {
    name?: string,
    indexOptions?: IndexOptions<string, false>,
    documentOptions?: IndexOptionsForDocumentSearch<unknown, false>,
}

// url-pattern.ts ------------------------------------------------------------
export type UrlPatternInstance = {
    pattern: string,
    resource: Route,
} & BaseInstance;

export type UrlPatternOptions = {
    name?: string,
    pattern: string,
}

export type UrlPatternParsed = {
    origin?: string,
    searchParams?: Record<string, string | number>,
    pathParams?: Record<string, string | number>
}

// events.ts
export type EventsOptions = {
    name?: string,
    batchSize?: number,
    batchMinIntervals?: number,
};

export type EventsInstance = {
    resource: EventEmitter,
    queues: Queue[],
    batchSize: number,
    batchMinIntervals: number,
} & BaseInstance;

// kv-store-adapter.ts
export type KVStoreAdapterInstance<T = ReallyAny> = KVStoreAdapterOptions<T>
    & BaseInstance;

export type KVStoreAdapterOptions<T = ReallyAny> = {
    resource?: ReallyAny,
    init?: (...args: ReallyAny[]) => ReallyAny | Promise<ReallyAny>,
    get: (connectedKv: KVStoreAdapterInstance, key: string) => Promise<T>,
    set: (connectedKv: KVStoreAdapterInstance, key: string, value: ReallyAny, options: ReallyAny) => Promise<T>,
    list: (connectedKv: KVStoreAdapterInstance, prefix?: string, options?: ReallyAny) => Promise<KVStoreAdapterListResult>,
}

export type KVStoreAdapterListResult = {
    keys: { key: string, size?: number }[],
    cursor?: string,
}
