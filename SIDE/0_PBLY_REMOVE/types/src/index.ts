/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheerioCrawlingContext } from '@crawlee/cheerio';
import { CrawlingContext, Dataset, KeyValueStore, Request, RequestOptions } from '@crawlee/core';
import { PlaywrightCrawlingContext } from '@crawlee/playwright';
import { ApifyClient } from 'apify-client';
import type EventEmitter from 'eventemitter3';
import type { IndexOptions, IndexOptionsForDocumentSearch } from 'flexsearch';
import type { JSONSchema7 as $JSONSchema7 } from 'json-schema';
import type { FromSchema } from 'json-schema-to-ts';
import type { Readonly } from 'json-schema-to-ts/lib/utils';
import type Queue from 'queue';
import type Route from 'route-parser';
import type { LeveledLogMethod, Logger } from 'winston';
import * as Transport from 'winston-transport';
// import MultiCrawler from './sdk/multi-crawler';
// import RequestQueue from './sdk/request-queue';

export type { JSONSchemaType } from 'ajv';

export type MakeSchema<S> = S | Readonly<S>;
export type JSONSchema = MakeSchema<_JSONSchema7>;
export type JSONSchemaWithMethods = MakeSchema<_JSONSchema7<JSONSchemaMethods>>;
export type JSONSchemaMethods = {
    resolveList?: (ref: ModelReference, methods: { getEntities: (modelName: string, ref?: ModelReference) => TrailDataModelItem[]; }) => TrailDataModelItem[],
    organizeList?: (items: TrailDataModelItem<ReallyAny>[], api: ContextApi) => TrailDataModelItem[] | Promise<TrailDataModelItem[]>,
    isListComplete?: (items: TrailDataModelItem[], api: ContextApi) => boolean | Promise<boolean>,
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

export type IsAny<T> = (
    unknown extends T
    ? [keyof T] extends [never] ? false : true
    : false
);

export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export type PathImpl<T, K extends keyof T> =
    K extends string
    ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
    ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
    : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
    : never;

export type Path<T> = IsAny<T> extends true ? string : PathImpl<T, keyof T> | keyof T;

export type PathValue<T, P extends Path<T>> =
    P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
    ? Rest extends Path<T[K]>
    ? PathValue<T[K], Rest>
    : never
    : never
    : P extends keyof T
    ? T[P]
    : never;


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

export type HookifyHandler<Handler> = Handler | Handler[];

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExtractSchemaModelNames<N> = N extends (ReadonlyArray<ReallyAny> | Array<ReallyAny> | Function) ? never :
    (N extends object ?
        (N extends { modelName: infer MN }
            ? Extract<MN, string> | ExtractSchemaModelNames<Omit<N, 'modelName'>>
            : { [K in keyof N]: ExtractSchemaModelNames<N[K]> }[keyof N])
        : never);

export type ExtractFlowsSchemaModelNames<F extends Record<string, FlowDefinition>> = {
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
    F extends Record<string, FlowDefinition>
> = ExcludeKeysWithTypeOf<{
    [K in keyof F]: StepName extends F[K]['steps'][number] ? F[K] : 'not this'
}, 'not this'>;

// apify --------------------------------------------------
export type RequestSource = Request | RequestOptions
export type RequestOptionalOptions = { priority?: number, crawlerOptions?: RequestCrawlerOptions, forefront?: boolean | undefined } | undefined
export type RequestContext = CrawlingContext & PlaywrightCrawlingContext & CheerioCrawlingContext

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
export type FlowsInstance = Record<string, FlowInstance>;
export type FlowDefinitions = Record<string, FlowDefinition>;

// flow.ts ------------------------------------------------------------
export type FlowInstance = {
    crawlerOptions?: RequestCrawlerOptions,
    steps: StepInstance[] | readonly Readonly<StepInstance>[],
    flows: string[] | readonly Readonly<string>[],
    input: ModelInstance<JSONSchema>,
    output: ModelInstance<JSONSchema>,
    reference?: ModelReference,
} & BaseInstance;

export type FlowDefinitionRaw = {
    name?: string,
    crawlerOptions?: RequestCrawlerOptions,
    steps?: StepInstance[],
    flows?: string[],
    input: ModelDefinition<JSONSchemaWithMethods>,
    output: ModelDefinition<JSONSchemaWithMethods>,
    reference?: ModelReference,
};

export type FlowDefinition = FlowDefinitionRaw | Readonly<FlowDefinitionRaw>;

export type FlowNamesObject<F extends Record<string, ReallyAny>> = {
    [K in keyof F]: Extract<K, string>
}

export type FlowOptions = FlowDefinition & { name: string }

export type FlowOptionsWithoutName = Omit<FlowOptions, 'name'>;

// steps.ts ------------------------------------------------------------
// eslint-disable-next-line max-len
export type StepCollectionInstance<
    M extends Record<string, ModelDefinition>,
    F extends Record<string, FlowDefinition>,
    S,
    I extends InputDefinition
> = {
        [StepName in Extract<keyof S, string>]: StepInstance> &
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

export type StepDefinition = Partial<Pick<StepInstance, 'crawlerOptions'>>

export type StepNamesSignature = Record<string, string>

// step.ts ------------------------------------------------------------
export type StepInstance = {
    name: string,
    crawlerOptions?: RequestCrawlerOptions,
    hooks?: ITStepHooks,
    reference?: ModelReference,
} & Partial<BaseInstance>;

export type StepHooks<Methods = any> = {
    mainHook?: HookOptions<StepOptionsHandlerParameters<Methods & ContextApi>>,
    postMainHook?: HookOptions<StepOptionsHandlerParameters<Methods & ContextApi>>,
    preNavigationHook?: HookOptions<StepOptionsHandlerParameters<Methods & ContextApi>>,
    onErrorHook?: HookOptions<[context: RequestContext, api: Methods & ContextApi, error: ReallyAny]>,
    postRequestFailedHook?: HookOptions<StepOptionsHandlerParameters<Methods & ContextApi>>
};

export type StepOptions = StepInstance

export type StepOptionsHandlerParameters<Methods = any> = [context: RequestContext, api: Methods]
export type StepOptionsHandler<Methods = unknown> = (context: RequestContext, api: Methods) => Promise<void>

// @usefelps/context-api -----------------------------------------------------------------
export type ContextApiInstance<
    F extends Record<string, FlowDefinition>,
    S,
    M extends Record<string, ModelDefinition>,
    I extends InputDefinition,
    StepName extends string = 'NO_STEPNAME'
> = ContextApi<I>
    & ContextApiFlowsAPI<F, S, M>
    & ContextApiModelAPI<M, S, F, StepName>;

export type ContextApi<I extends InputDefinition = InputDefinition> = ContextApiMetaAPI<I> & ContextApiHelpersAPI;

export type ContextApiOptions = {
    extend?: (context: RequestContext, api: ReallyAny, actor: ActorInstance) => Record<string, ReallyAny>
}

// context-api-flow.ts ------------------------------------------------------------
export type ContextApiFlowsInstance<F extends Record<string, FlowDefinition>, S, M extends Record<string, ModelDefinition>> = {
    handler: (context: RequestContext) => ContextApiFlowsAPI<F, S, M>,
};

export type ContextApiFlowsAPI<F extends Record<string, FlowDefinition>, S, M> = {
    currentStep(): string,
    currentFlow(): string,
    isCurrentStep: (stepName: keyof S) => boolean,
    isCurrentFlow: (flowName: keyof F) => boolean,
    isCurrentActor: (actorId: string) => boolean,
    isStep: (stepNameToTest: string, stepNameExpected: keyof S) => boolean,
    isFlow: (flowNameToTest: string, flowNameExpected: keyof F) => boolean,
    isSomeStep: (stepNameToTest: string, stepNamesExpected: (keyof S)[]) => boolean,
    isSomeFlow: (flowNameToTest: string, flowNamesExpected: (keyof F)[]) => boolean,
    asFlowName: (flowName: string) => (string | undefined), // | Extract<keyof F, string>
    asStepName: (stepName: string) => (string | undefined), // | Extract<keyof S, string>
    start: (
        flowName: string,
        request: RequestSource,
        input?: ReallyAny, // FromSchema<F[FlowName]['input']>
        options?: {
            reference?: ModelReference<ReallyAny>,
            crawlerOptions?: RequestCrawlerOptions | undefined,
            stepName?: string, // Extract<keyof F[FlowName]['steps'], string>
            useNewTrail?: boolean
        }
    ) => ModelReference<M>;
    paginate: (request: RequestSource, reference?: ModelReference<M>, options?: { crawlerOptions?: RequestCrawlerOptions }) => void;
    next: (stepName: Extract<keyof S, string>, request: RequestSource, reference?: ModelReference<M>, options?: { crawlerOptions?: RequestCrawlerOptions }) => void;
    nextDefault: (request?: RequestSource, reference?: ModelReference<M>, options?: { crawlerOptions?: RequestCrawlerOptions }) => void;
    stop: (reference?: ModelReference<M>) => void;
    retry: (reference?: ModelReference<M>) => void;
};

// context-api-model.ts ------------------------------------------------------------
export type ContextApiModelInstance<M extends Record<string, ModelDefinition>> = {
    handler: (context: RequestContext) => ContextApiModelAPI<M>,
};

export type KeyedSchemaType<TModels extends Record<string, ModelDefinition>> = {
    [TModelName in keyof TModels]: {
        schema: FromSchema<TModels[TModelName]['schema']>
    }
}

// export type ContextApiModelByFlowAPI<
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

export type ContextApiModelAPI<
    M extends Record<string, ModelDefinition>,
    S = 'NO_STEPS',
    F extends Record<string, FlowDefinition> = Record<string, never>,
    StepName extends string = 'NO_STEPNAME',
    AvailableFlows = StepName extends 'NO_STEPNAME' ? F : ExtractFlowsWithStep<StepName, S, F>,
    // eslint-disable-next-line max-len
    AvailableModelNames = StepName extends 'NO_STEPNAME' ? (AvailableFlows extends Record<string, FlowDefinition> ? ExtractFlowsSchemaModelNames<AvailableFlows> : keyof M) : keyof M,
    AvailableFlowNames = AvailableFlows extends Record<string, FlowDefinition> ? keyof AvailableFlows : keyof F,
    N extends Record<string, ReallyAny> = KeyedSchemaType<M>,
> = ContextApiModelByFlowAPI<N, AvailableModelNames> & {
    inFlow: <
        FlowName extends AvailableFlowNames,
        // eslint-disable-next-line max-len
        FlowAvailableModelNames = AvailableFlows extends Record<string, FlowDefinition> ? (FlowName extends keyof AvailableFlows ? ExtractSchemaModelNames<AvailableFlows[FlowName]['output']['schema']> : keyof M) : keyof M,
    > (flowName: FlowName) => ContextApiModelByFlowAPI<N, FlowAvailableModelNames>,
};

export type ContextApiModelByFlowAPI<
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

// context-api-meta.ts ------------------------------------------------------------
export type ContextApiMetaInstance = {
    handler: (context: RequestContext) => ContextApiMetaAPI,
};

export type ContextApiMetaAPI<I extends InputDefinition = InputDefinition> = {
    getActorName: () => string | undefined;
    getActorInput: () => ReallyAny | FromSchema<I['schema']>;
    getUserData: () => Record<string, unknown>,
    getMetaData: () => RequestMetaData,
    getReference: () => RequestMetaData['reference'],
    getFlowInput: () => TrailFlowState['input'];
    getFlowName: () => string;
    getStepName: () => string;
}

// context-api-utils.ts ------------------------------------------------------------
export type ContextApiHelpersInstance = {
    handler: (context: RequestContext) => ContextApiHelpersAPI,
};

export type ContextApiHelpersAPI = {
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
    frequestId: UniqueyKey,
    ftrailId: UniqueyKey,
    fflowId: UniqueyKey,
    factorId: UniqueyKey,
}>;

// stores.ts ------------------------------------------------------------
// eslint-disable-next-line max-len
export type StoreCollectionInstance<StateNames extends string[] = DefaultStateNames, BucketNames extends string[] = DefaultBucketNames> = GenerateObject<BucketNames & DefaultBucketNames, BucketInstance> & GenerateObject<StateNames & DefaultStateNames, StateInstance>;

export type StoreInstance = StateInstance | BucketInstance;

export type DefaultStateNames = ['state', 'trails', 'incorrectDataset']
export type DefaultBucketNames = ['cachedRequests', 'files', 'responseBodies', 'browserTraces']

export type StoreCollectionOptions = {
    dataStores?: StateOptions[],
    Buckets?: BucketOptions[],
    // dataStoreNames?: Extract<ValueOf<StateNames>, string>[],
    // BucketNames?: Extract<ValueOf<BucketNames>, string>[],
    dataStoreAdapter?: KVStoreAdapterInstance,
    BucketAdapter?: KVStoreAdapterInstance,
}

export type StorageStatistics = {
    reads: number,
    writes: number
}

// state.ts ------------------------------------------------------------
export type StateInstance<T = any> = {
    type: 'state',
    adapter: KVStoreAdapterInstance,
    kvKey: string;
    pathRoot: string;
    splitByKey?: boolean,
    initialized: boolean;
    storage: Record<string, unknown>;
    stats: StorageStatistics;
    _type?: T
} & BaseInstance;

export type StateOptions = {
    adapter?: KVStoreAdapterInstance,
    name: string,
    key?: string,
    kvKey?: string,
    splitByKey?: boolean,
    pathRoot?: string
}

export type DataPath = string;

// bucket.ts ------------------------------------------------------------
export type BucketInstance = {
    type: 'bucket',
    kvKey: string,
    resource: KeyValueStore | undefined,
    initialized: boolean,
    stats: StorageStatistics;
} & BaseInstance;

export type BucketOptions = {
    name: string,
    kvKey?: string,
    key?: string,
}

// trail.ts ------------------------------------------------------------
export type TrailInstance = {
    id: string;
    store: StateInstance;
    models: ModelsInstance<ReallyAny>;
};

export type TrailOptions = {
    id?: string;
    store?: StateInstance;
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
        [flowId: string]: TrailFlowState,
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
//     store: State;
//     methods: GenerateObject<keyof ModelSchemas, TrailInOutMethods>,
//     model: Model,
// }

// trails.ts
export type TrailsOptions = {
    actor: ActorInstance,
    store?: StateInstance,
};

export type TrailsInstance = {
    actor: ActorInstance,
    store: StateInstance,
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
    store: StateInstance;
    path: string;
} & BaseInstance;

export type TrailDataRequestsOptions = {
    id: UniqueyKey,
    type: TrailDataStages,
    store: StateInstance;
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
    store: StateInstance;
} & BaseInstance;

export type TrailDataModelOptions = {
    id: UniqueyKey,
    type: TrailDataStages,
    model: ModelInstance,
    store: StateInstance,
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
export type RequestRequestQueueInstance = {
    resource?: ReallyAny, // RequestQueue
} & BaseInstance;

export type RequestQueueOptions = {
    name?: string,
}

// queues.ts ------------------------------------------------------------
export type QueueCollectionInstance<Names extends string[] = []> = Partial<GenerateObject<Names | DefaultQueueNames, StepInstance>>;

export type QueueCollectionOptions = {
    names?: string[],
}

export type DefaultQueueNames = ['default'];

// dataset.ts ------------------------------------------------------------
export type DatasetInstance = {
    name: string;
    hooks: DatasetHooks;
    resource: Dataset | undefined;
} & BaseInstance;

export type DatasetHooks = {
    preDataPushedHook: HookInstance<[dataset: DatasetInstance, data: ReallyAny | ReallyAny[]]>
    postDataPushFailedHook: HookInstance<[dataset: DatasetInstance, data: ReallyAny | ReallyAny[], error: ReallyAny]>
    postDataPushedHook: HookInstance<[dataset: DatasetInstance, data: ReallyAny | ReallyAny[]]>
};

export type DatasetOptions = {
    name?: string,
    hooks?: DatasetHooks
}

// datasets.ts ------------------------------------------------------------
export type DatasetCollectionInstance<Names extends string[] = []> = GenerateObject<Names | DefaultDatasetNames, DatasetInstance>;

export type DatasetCollectionOptions<Names extends string[] = []> = {
    names?: Names,
};

export type DefaultDatasetNames = ['default'];

// actor.ts ------------------------------------------------------------
export type ActorInstance<
    ITInput extends InputInstance = InputInstance,
    ITCrawler extends CrawlerInstance = CrawlerInstance,
    ITModels extends Record<string, ModelDefinition> = Record<string, ModelDefinition>,
    ITStores extends StoreCollectionInstance = StoreCollectionInstance,
    ITQueues extends QueueCollectionInstance = QueueCollectionInstance,
    ITDatasets extends DatasetCollectionInstance = DatasetCollectionInstance,
    ITFlows extends ReallyAny = ReallyAny,
    ITSteps extends StepCollectionInstance<ITModels, ReallyAny, ReallyAny, ITInput> = StepCollectionInstance<ITModels, ReallyAny, ReallyAny, ITInput>,
> = ActorBaseInstance<ITInput, ITCrawler, ITModels, ITStores, ITQueues, ITDatasets, ITFlows, ITSteps> & BaseInstance;

export type ActorBaseInstance<
    ITInput extends InputInstance = InputInstance,
    ITCrawler extends CrawlerInstance = CrawlerInstance,
    ITModels extends Record<string, ModelDefinition> = Record<string, ModelDefinition>,
    ITStores extends StoreCollectionInstance = StoreCollectionInstance,
    ITQueues extends QueueCollectionInstance = QueueCollectionInstance,
    ITDatasets extends DatasetCollectionInstance = DatasetCollectionInstance,
    ITFlows extends ReallyAny = ReallyAny,
    ITSteps extends StepCollectionInstance<ITModels, ReallyAny, ReallyAny, ITInput> = StepCollectionInstance<ITModels, ReallyAny, ReallyAny, ITInput>,
    ITHooks = ReallyAny
> = {
    name: string,
    input: ITInput,
    crawlerOptions: RequestCrawlerOptions,
    crawler: ITCrawler,
    steps: ITSteps;
    stepApiOptions: ContextApiOptions,
    flows: ITFlows;
    models: ITModels;
    stores: ITStores;
    queues: ITQueues;
    datasets: ITDatasets;
    hooks: ITHooks;
};

export type ActorOptions<
    ITInput extends InputInstance = InputInstance,
    ITCrawler extends CrawlerInstance = CrawlerInstance,
    ITModels extends Record<string, ModelDefinition> = Record<string, ModelDefinition>,
    ITStores extends StoreCollectionInstance = StoreCollectionInstance,
    ITQueues extends QueueCollectionInstance = QueueCollectionInstance,
    ITDatasets extends DatasetCollectionInstance = DatasetCollectionInstance,
    ITFlows extends ReallyAny = ReallyAny,
    ITSteps extends StepCollectionInstance<ITModels, ReallyAny, ReallyAny, ITInput> = StepCollectionInstance<ITModels, ReallyAny, ReallyAny, ITInput>,
> = Partial<ActorBaseInstance<ITInput, ITCrawler, ITModels, ITStores, ITQueues, ITDatasets, ITFlows, ITSteps>>

export type ActorHooks<
    ITInput extends InputInstance = InputInstance,
    ITCrawler extends CrawlerInstance = CrawlerInstance,
    ITModels extends Record<string, ModelDefinition> = Record<string, ModelDefinition>,
    ITStores extends StoreCollectionInstance = StoreCollectionInstance,
    ITQueues extends QueueCollectionInstance = QueueCollectionInstance,
    ITDatasets extends DatasetCollectionInstance = DatasetCollectionInstance,
    ITFlows extends ReallyAny = ReallyAny,
    ITSteps extends StepCollectionInstance<ITModels, ReallyAny, ReallyAny, ITInput> = StepCollectionInstance<ITModels, ReallyAny, ReallyAny, ITInput>,
    LocalActorInstance = ActorInstance<ITInput, ITCrawler, ITModels, ITStores, ITQueues, ITDatasets, ITFlows, ITSteps>
> = {
    preActorStartedHook?: HookInstance<[actor: LocalActorInstance, input: ActorInput]>,
    preActorEndedHook?: HookInstance<[actor: LocalActorInstance]>,
    preCrawlerStartedHook?: HookInstance<[actor: LocalActorInstance]>,
    postCrawlerEndedHook?: HookInstance<[actor: LocalActorInstance]>,
    postCrawlerFailedHook?: HookInstance<[actor: LocalActorInstance, error: ReallyAny]>,
    preQueueStartedHook?: HookInstance<[actor: LocalActorInstance]>,
    postQueueEndedHook?: HookInstance<[actor: LocalActorInstance]>,
    preFlowStartedHook?: HookInstance<[actor: LocalActorInstance]>,
    postFlowEndedHook?: HookInstance<[actor: LocalActorInstance]>,
    preStepStartedHook?: HookInstance<[actor: LocalActorInstance, context: RequestContext]>,
    postStepEndedHook?: HookInstance<[actor: LocalActorInstance, context: RequestContext]>,
    preStepFailedHook?: HookInstance<[actor: LocalActorInstance, error: ReallyAny]>,
    postStepRequestFailedHook?: HookInstance<[actor: LocalActorInstance, error: ReallyAny]>,
}

export type ActorInput = string | {
    [x: string]: any;
} | Buffer | null;

// hooks.ts ------------------------------------------------------------
export type HooksInstance<M extends Record<string, ModelDefinition>, F extends Record<string, FlowDefinition>, S, I extends InputDefinition> = {
    [K in DefaultHookNames[number]]: StepInstance>;
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
    stepStop: boolean,
    flowStop: boolean,
    flowStart: boolean,
    flowName: string,
    stepName: string,
    actorId: string,
    trailId: string,
    flowId: string,
    requestId: string,
    crawlerOptions?: RequestCrawlerOptions,
}

// crawler.ts ------------------------------------------------------------
export type CrawlerInstance = {
    launcher?: ReallyAny, // MultiCrawler |
    resource: undefined, // MultiCrawler |
} & BaseInstance;

export type CrawlerOptions = {
    launcher?: ReallyAny, //  MultiCrawler |
}

export type LogMethods = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug';
export type LogLevels<LevelNames extends string = LogMethods> = Record<LevelNames, number>;

// logger.ts ------------------------------------------------------------
export type LoggerOptions = {
    suffix?: string,
    level?: LogMethods,
    levels?: LogLevels,
    transports?: Transport[] | Transport
}

export type LoggerResource<LevelNames extends string = LogMethods> = Record<LevelNames, LeveledLogMethod>;

export type LoggerInstance = {
    parent: { id: string },
    resource: Logger
} & LoggerOptions;

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
export type InputInstance<TSchema extends JSONSchema = ReallyAny> = {
    data: ReallyAny | undefined, // FromSchema<TSchema>
    schema: TSchema,
};

export type InputDefinition<TSchema extends JSONSchema = ReallyAny> = {
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
    resource?: EventEmitter,
    queues: Queue[],
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

// logger-adapter.ts
export type LoggerAdapterInstance = LoggerAdapterOptions & BaseInstance;

export type LoggerAdapterOptions = {
    name: string,
    adapter: Transport,
}

// hook.ts

export type HookParametersSignatureDefault = ReallyAny[];
export type HookSignature<P extends any[], O = void> = (...args: P) => Promise<O>;

export type HookOptions<HookParametersSignature extends HookParametersSignatureDefault = HookParametersSignatureDefault> = {
    name?: string,
    handlers?: HookSignature<HookParametersSignature>[],
    validationHandler?: (...args: HookParametersSignature) => Promise<boolean>,
    onErrorHook?: HookInstance,
};

export type HookInstance<HookParametersSignature extends HookParametersSignatureDefault = HookParametersSignatureDefault> = {
    handlers?: HookSignature<HookParametersSignature>[],
    validationHandler?: (...args: HookParametersSignature) => Promise<boolean>,
    onErrorHook?: HookInstance,
} & Partial<BaseInstance>;

