/* eslint-disable @typescript-eslint/no-explicit-any */
import Apify from 'apify';
import { ApifyClient } from 'apify-client';
import { LogLevel } from 'apify/build/utils_log';
import { IndexOptions, IndexOptionsForDocumentSearch } from 'flexsearch';
import { JSONSchema7 as $JSONSchema7 } from 'json-schema';
import type { FromSchema } from 'json-schema-to-ts';
import { Readonly } from 'json-schema-to-ts/lib/utils';
import MultiCrawler, { MultiCrawlerOptions } from './sdk/multi-crawler';
import RequestQueue from './sdk/request-queue';

export type { JSONSchemaType } from 'ajv';

export type MakeSchema<S> = S | Readonly<S>;
export type JSONSchema = MakeSchema<_JSONSchema7>;
export type JSONSchemaWithMethods = MakeSchema<_JSONSchema7<JSONSchemaMethods>>;
export type JSONSchemaMethods = {
    organize?: (items: TrailDataModelItem[], api: GeneralStepApi) => TrailDataModelItem[] | Promise<TrailDataModelItem[]>,
    limit?: (items: TrailDataModelItem[], api: GeneralStepApi) => boolean | Promise<boolean>,
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

export type AnyObject = Record<string, ReallyAny>;
export type ReallyAny = any;
export type UniqueyKey = string;
export type ReferenceKey = string;

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

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
export type GeneralKeyedObject<N extends Record<string, string>, T> = { [K in Extract<keyof N, string>]: T };
export type GenerateObject<N extends string[], T> = { [K in N[number]]: T };
export type ValueOf<T> = T[keyof T];

// apify --------------------------------------------------
export type RequestSource = import('apify').Request | import('apify').RequestOptions
export type RequestOptionalOptions = { priority?: number, type?: RequestCrawlerMode, forefront?: boolean | undefined } | undefined
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
export type FlowsInstance<StepNames = string> = FlowDefinitions<StepNames, ReallyAny>;

export type FlowDefinitions<StepNames, T extends Record<string, FlowDefinition<StepNames>>> = {
    [K in keyof T]: T[K] extends FlowDefinition<StepNames> ? T[K] & { name: string } : never
};

export type FlowDefinition<StepNames = string> = PartialBy<FlowOptions<StepNames>, 'name'>

// flow.ts ------------------------------------------------------------
export type FlowInstance<StepNames> = {
    crawlerMode?: RequestCrawlerMode,
    steps: StepNames[],
    output: ModelInstance<JSONSchema>,
} & BaseInstance;

export type FlowOptions<StepNames = string> = {
    name: string,
    crawlerMode?: RequestCrawlerMode,
    steps: StepNames[],
    output: ModelDefinition<JSONSchemaWithMethods>,
}

export type FlowOptionsWithoutName<StepNames = string> = Omit<FlowOptions<StepNames>, 'name'>;

// steps.ts ------------------------------------------------------------
export type StepsInstance<M extends Record<string, ModelDefinition>, F, S, I extends InputDefinition> = {
    [K in keyof S]: S[K] extends StepDefinition ? StepInstance<StepApiInstance<F, S, M, I>> & S[K] : never
};

export type StepsOptions<T> = {
    STEPS?: T
}

export type StepDefinitions<T extends Record<string, StepDefinition>> = {
    [K in keyof T]: T[K] extends StepDefinition ? {
        crawlerMode: T[K]['crawlerMode'],
    } : never
};

export type StepDefinition<Methods = unknown> = Partial<Pick<StepInstance<Methods & GeneralStepApi>, 'crawlerMode'>>

export type StepNamesSignature = Record<string, string>

// step.ts ------------------------------------------------------------
export type StepInstance<Methods = unknown> = {
    name: string,
    crawlerMode?: RequestCrawlerMode,
    handler?: StepOptionsHandler<Methods & GeneralStepApi>,
    errorHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    requestErrorHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    // extendApi?: <T>(context: RequestContext, api: Methods & GeneralStepApi) => T,
} & BaseInstance;

export type StepOptions<Methods = unknown> = {
    name: string,
    crawlerMode?: RequestCrawlerMode,
    handler?: StepOptionsHandler<Methods & GeneralStepApi>,
    errorHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    requestErrorHandler?: StepOptionsHandler<Methods & GeneralStepApi>,
    // extendApi?: <T>(context: RequestContext, api: Methods & GeneralStepApi) => T,
    // extendStepApi?: StepCustomApiExtend<InitialMethods, Methods>,
    // stepApi?: StepCustomApi<InitialMethods, Methods>,
}

export type StepOptionsHandler<Methods = unknown> = (context: RequestContext, api: Methods) => Promise<void>

// step-api.ts -----------------------------------------------------------------
export type StepApiInstance<F, S, M extends Record<string, ModelDefinition>, I extends InputDefinition> = GeneralStepApi<I>
    & StepApiFlowsAPI<F, S, M>
    & StepApiModelAPI<M>;

export type GeneralStepApi<I extends InputDefinition = InputDefinition> = StepApiMetaAPI & StepApiUtilsAPI<I>;

// step-api-flow.ts ------------------------------------------------------------
export type StepApiFlowsInstance<F, S, M extends Record<string, ModelDefinition>> = {
    handler: (context: RequestContext) => StepApiFlowsAPI<F, S, M>,
};

export type StepApiFlowsAPI<F, S, M> = {
    asFlowName: (flowName: string) => (Extract<keyof F, string> | undefined),
    start: (
        flowName: Extract<keyof F, string>,
        request: RequestSource,
        input?: any,
        reference?: ModelReference<M>,
        options?: { crawlerMode: RequestCrawlerMode }
    ) => ModelReference<M>;
    goto: (stepName: Extract<keyof S, string>, request: RequestSource, reference?: ModelReference<M>, options?: { crawlerMode: RequestCrawlerMode }) => void;
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

// eslint-disable-next-line max-len
export type StepApiModelAPI<
    M extends Record<string, ModelDefinition>,
    N extends Record<string, ReallyAny> = KeyedSchemaType<M>
    > = {
        add: <ModelName extends keyof N>(
            modelName: ModelName,
            value: N[ModelName]['schema'],
            ref?: ModelReference<M>,
        ) => ModelReference<M>;
        addPartial: <ModelName extends keyof N>(
            modelName: ModelName,
            value: Partial<N[ModelName]['schema']>,
            ref?: ModelReference<M>,
        ) => ModelReference<M>;
        get: <ModelName extends keyof N>(
            modelName: ModelName,
            ref?: ModelReference<M>,
        ) => N[ModelName]['schema'];
        update: <ModelName extends keyof N>
            // eslint-disable-next-line max-len
            (
            modelName: ModelName,
            value: Partial<N[ModelName]['schema']> | ((previous: Partial<N[ModelName]['schema']>) => Partial<N[ModelName]['schema']>),
            ref?: ModelReference<M>,
        ) => ModelReference<M>;
        updatePartial: <ModelName extends keyof N>
            // eslint-disable-next-line max-len
            (
            modelName: ModelName,
            value: Partial<N[ModelName]['schema']> | ((previous: Partial<N[ModelName]['schema']>) => Partial<N[ModelName]['schema']>),
            ref?: ModelReference<M>,
        ) => ModelReference<M>;
    };

// step-api-meta.ts ------------------------------------------------------------
export type StepApiMetaInstance = {
    handler: (context: RequestContext) => StepApiMetaAPI,
};

export type StepApiMetaAPI = {
    getUserData: () => Record<string, unknown>,
    getMetaData: () => RequestMetaData,
    getRerence: () => RequestMetaData['reference'],
}

// step-api-utils.ts ------------------------------------------------------------
export type StepApiUtilsInstance = {
    handler: (context: RequestContext) => StepApiUtilsAPI,
};

export type StepApiUtilsAPI<I extends InputDefinition = InputDefinition> = {
    getFlowInput: () => TrailState['input'];
    getActorInput: () => ReallyAny | I['schema'];
    absoluteUrl: (url: string) => string | void,
}

// models.ts ------------------------------------------------------------
export type ModelsInstance<T> = T;

export type ModelDefinitions<T extends Record<string, ModelDefinition>> = T
// model.ts ------------------------------------------------------------
export type ModelInstance<TSchema = JSONSchema> = ModelDefinition<TSchema> & BaseInstance;

export type ModelDefinition<TSchema = JSONSchema> = {
    name?: string,
    schema: TSchema,
    parents?: string[],
}

export type ModelOptions<TSchema = JSONSchema> = ModelDefinition<TSchema>;

export type ModelReference<T = unknown> = Partial<{
    [K in Extract<keyof T, string> as `${SnakeToCamelCase<K>}Key`]: UniqueyKey;
} & { requestKey: UniqueyKey, trailKey: UniqueyKey }>;

// stores.ts ------------------------------------------------------------
// eslint-disable-next-line max-len
export type StoresInstance<DataStoreNames extends string[] = [], FileStoreNames extends string[] = []> = GenerateObject<FileStoreNames & DefaultFileStoreNames, FileStoreInstance> & GenerateObject<DataStoreNames & DefaultDataStoreNames, DataStoreInstance>;

export type StoreInstance = DataStoreInstance | FileStoreInstance;

export type DefaultDataStoreNames = ['state', 'trails', 'incorrectDataset']
export type DefaultFileStoreNames = ['files', 'responseBodies', 'browserTraces']

export type StoresOptions<DataStoreNames extends string[] = [], FileStoreNames extends string[] = []> = {
    dataStoreNames?: Extract<ValueOf<DataStoreNames>, string>[],
    fileStoreNames?: Extract<ValueOf<FileStoreNames>, string>[],
}

// data-store.ts ------------------------------------------------------------
export type DataStoreInstance = {
    type: 'data-store',
    kvKey: string;
    pathPrefix: string;
    initialized: boolean;
    state: Record<string, unknown>;
} & BaseInstance;

export type DataStoreOptions = {
    name: string,
    key?: string,
    kvKey?: string,
    pathPrefix?: string,
}

// file-store.ts ------------------------------------------------------------
export type FileStoreInstance = {
    type: 'file-store',
    kvKey: string,
    resource: Apify.KeyValueStore | undefined,
    initialized: boolean,
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

export type TrailState = {
    id: string,
    flow: string,
    input: any,
    output: any,
    stats: {
        startedAt: string,
        endedAt: string,
        retries: number,
        sizeInKb: number,
        aggregatedDurationInMs: number,
    },
    ingested: TrailDataStage,
    digested: TrailDataStage,
}

// export type TrailInOutMethodsOptions<ModelSchemas> = {
//     name: string;
//     path: TrailDataStages;
//     store: DataStore;
//     methods: GenerateObject<keyof ModelSchemas, TrailInOutMethods>,
//     model: Model,
// }

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
    resource?: RequestQueue,
} & BaseInstance;

export type QueueOptions = {
    name?: string,
}

// queues.ts ------------------------------------------------------------
export type QueuesInstance<Names extends string[] = []> = GenerateObject<Names | DefaultQueueNames, StepInstance>;

export type QueuesOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

export type DefaultQueueNames = ['default'];

// dataset.ts ------------------------------------------------------------
export type DatasetInstance = {
    name: string;
    resource: Apify.Dataset | undefined;
} & BaseInstance;

export type DatasetOptions = {
    name?: string,
}

// datasets.ts ------------------------------------------------------------
export type DatasetsInstance<Names extends string[] = []> = GenerateObject<Names | DefaultDatasetNames, DatasetInstance>;

export type DatasetsOptions<Names extends string[] = []> = {
    names?: Names,
};

export type DefaultDatasetNames = ['default'];

// actor.ts ------------------------------------------------------------
export type ActorInstance = {
    name?: string,
    crawlerMode?: RequestCrawlerMode,
    input: InputInstance,
    crawler: CrawlerInstance,
    steps: StepsInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
    flows: FlowsInstance<ReallyAny>;
    models: ModelsInstance<ReallyAny>;
    stores: StoresInstance;
    queues: QueuesInstance;
    datasets: DatasetsInstance;
    hooks: HooksInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
} & BaseInstance;

export type ActorOptions = {
    name?: string,
    input?: InputInstance,
    crawlerMode?: RequestCrawlerMode,
    crawler?: CrawlerInstance,
    steps?: StepsInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
    flows?: FlowsInstance<ReallyAny>;
    models?: ModelsInstance<ReallyAny>;
    stores?: StoresInstance;
    queues?: QueuesInstance;
    datasets?: DatasetsInstance;
    hooks?: HooksInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
}

// hooks.ts ------------------------------------------------------------
export type HooksInstance<M extends Record<string, ModelDefinition>, F, S, I extends InputDefinition> = {
    [K in DefaultHookNames[number]]: StepInstance<StepApiInstance<F, S, M, I>>;
};

export type DefaultHookNames = ['STEP_STARTED', 'STEP_ENDED', 'STEP_FAILED', 'STEP_REQUEST_FAILED',
    'ACTOR_STARTED', 'ACTOR_ENDED', 'QUEUE_STARTED', 'QUEUE_ENDED'];

export type GenerateHookFireMethods<T extends string[]> = {
    [K in T[number]as `fire${SnakeToPascalCase<K>}`]: (request: RequestSource) => void;
};

export type HookMethods = GenerateHookFireMethods<DefaultHookNames>;

// request-meta.ts ------------------------------------------------------------
export type RequestMetaInstance = {
    request: RequestSource,
    userData: Record<string, unknown>,
    data: RequestMetaData,
} & BaseInstance;

export type RequestMetaOptions = {
    nothing?: string,
}

export type RequestCrawlerMode = 'http' | 'chromium' | 'firefox' | 'safari';

export type RequestMetaData = {
    flowName: string,
    stepName: string,
    crawlerMode: RequestCrawlerMode,
    reference: Partial<ModelReference<any>>,
}

// crawler.ts ------------------------------------------------------------
export type CrawlerInstance = {
    launcher?: MultiCrawler | ReallyAny,
    crawlerOptions?: Partial<MultiCrawlerOptions>,
} & BaseInstance;

export type CrawlerOptions = {
    launcher?: MultiCrawler | ReallyAny,
    crawlerOptions?: Partial<MultiCrawlerOptions>,
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
