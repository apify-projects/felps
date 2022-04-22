/* eslint-disable @typescript-eslint/no-explicit-any */
import type Apify from 'apify';
import { CrawlingContext } from 'apify';
import { ApifyClient } from 'apify-client';
import { LogLevel } from 'apify/build/utils_log';
import type { FromSchema, JSONSchema7 } from 'json-schema-to-ts';
import RequestQueue from '../overrides/request-queue';

export type { JSONSchemaType } from 'ajv';

export type reallyAny = any;
export type UniqueyKey = string;

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
    name: string,
    key?: string,
    uid?: string,
    id?: string,
}

// flows.ts ------------------------------------------------------------
export type FlowsInstance<T> = T

export type FlowNamesSignature = Record<string, string>

export type FlowsOptions<T> = {
    FLOWS?: T
}

export type FlowDefinitions<StepNames, T extends Record<string, FlowDefinition<StepNames>>> = {
    [K in keyof T]: T[K] extends FlowDefinition<StepNames> ? {
        crawlerMode: T[K]['crawlerMode'],
        steps: T[K]['steps'],
        output: T[K]['output'],
    } : never
};

export type FlowDefinition<StepNames = unknown> = Partial<FlowInstance<StepNames>>

// flow.ts ------------------------------------------------------------
export type FlowInstance<StepNames> = {
    crawlerMode?: RequestCrawlerMode,
    steps: StepNames[],
    output: JSONSchema7,
} & BaseInstance;

export type FlowOptions = {
    name: string,
    crawlerMode?: RequestCrawlerMode,
    steps?: StepInstance[],
    output?: JSONSchema7,
}

// steps.ts ------------------------------------------------------------
export type StepsInstance<M, F, S> = {
    [K in keyof S]: S[K] extends StepDefinition ? StepInstance<GenerateStepApi<F, S, M>> & S[K] : never
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
export type StepApiInstance<FlowNames, StepNames, ModelSchemas extends Record<string, unknown>> =
    (context: CrawlingContext) => GenerateStepApi<FlowNames, StepNames, ModelSchemas>;
export type GeneralStepApi = StepApiMetaAPI & StepApiUtilsAPI;
export type GenerateStepApi<F, S, M> = GeneralStepApi
    & StepApiFlowsAPI<F, S, M>
    & StepApiModelAPI<M>;

// step-api-flow.ts ------------------------------------------------------------
export type StepApiFlowsInstance<FlowNames, StepNames, ModelSchemas> = {
    handler: (context: CrawlingContext) => StepApiFlowsAPI<FlowNames, StepNames, ModelSchemas>,
};

export type StepApiFlowsAPI<F, S, M> = {
    start: (flowName: Extract<keyof F, string>, request: RequestSource, input?: any, reference?: ModelReference<M>) => ModelReference<M>;
    goto: (stepName: Extract<keyof S, string>, request: RequestSource, reference?: ModelReference<M>) => void;
};

// step-api-model.ts ------------------------------------------------------------
export type StepApiModelInstance<M extends Record<string, ModelDefinition>> = {
    handler: (context: CrawlingContext) => StepApiModelAPI<M>,
};

// eslint-disable-next-line max-len
export type StepApiModelAPI<M> = {
    set: <ModelName extends keyof M>(
        modelName: ModelName,
        value: FromSchema<M extends Record<string, ModelDefinition> ? M[ModelName]['schema'] : never>,
        ref?: ModelReference<M>,
    ) => ModelReference<M>;
    get: <ModelName extends keyof M>(
        modelName: ModelName,
        ref?: ModelReference<M>,
    ) => FromSchema<M extends Record<string, ModelDefinition> ? M[ModelName]['schema'] : never>;
    update: <ModelName extends keyof M>
        // eslint-disable-next-line max-len
        (
        modelName: ModelName,
        value: Partial<FromSchema<M extends Record<string, ModelDefinition> ? M[ModelName]['schema'] : never>>,
        ref?: ModelReference<M>,
    ) => ModelReference<M>;
};

// step-api-meta.ts ------------------------------------------------------------
export type StepApiMetaInstance = {
    handler: (context: CrawlingContext) => StepApiMetaAPI,
};

export type StepApiMetaAPI = {
    getUserData: () => Record<string, unknown>,
    getMetaData: () => RequestMetaData,
    getRerence: () => RequestMetaData['reference'],
}

// step-api-utils.ts ------------------------------------------------------------
export type StepApiUtilsInstance = {
    handler: (context: CrawlingContext) => StepApiUtilsAPI,
};

export type StepApiUtilsAPI = {
    getInput: () => any,
    absoluteUrl: (url: string) => string | void,
}

// models.ts ------------------------------------------------------------
export type ModelsInstance<T> = T;

export type ModelsOptions<T> = {
    MODELS?: T,
}

export type ModelDefinitions<T extends Record<string, ModelDefinition>> = {
    [K in keyof T]: T[K] extends ModelDefinition ? {
        schema: FromSchema<T[K]['schema']>,
    } : never
};

// export type GenerateModelSetMethods<ModelNames> = {
//     [K in Extract<ModelNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<ModelOptions>) => void;
// };

// model.ts ------------------------------------------------------------
export type ModelInstance = ModelDefinition & BaseInstance;

export type ModelDefinition = {
    name?: string,
    schema: JSONSchema7,
}

export type ModelOptions = {
    name: string,
    schema?: JSONSchema7,
}

export type ModelReference<T = unknown> = Partial<{
    [K in Extract<keyof T, string> as `${SnakeToCamelCase<K>}Key`]: UniqueyKey;
} & { requestKey: UniqueyKey, trailKey: UniqueyKey }>;

export type ModelSchemasSignature = Record<string, unknown>;

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
    resource: Apify.KeyValueStore,
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
    models: ModelsInstance;
};

export type TrailOptions = {
    id?: string;
    actor?: ActorInstance;
}

export type TrailState = {
    id: string,
    input: any,
    requests: {
        [key: string]: any
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
    referenceKey: string;
    store: DataStoreInstance;
    path: string;
} & BaseInstance;

export type TrailDataRequestsOptions = {
    id: UniqueyKey,
    type: TrailDataStages,
    store: DataStoreInstance;
}

export type TrailDataRequestItemStatus = 'CREATED' | 'DISCARDED' | 'QUEUED' | 'STARTED' | 'SUCCEEDED' | 'FAILED';

export type TrailDataRequestItem = {
    id: UniqueyKey,
    source: RequestSource,
    status: TrailDataRequestItemStatus,
}

// trail-data-model.ts ------------------------------------------------------------
export type TrailDataModelInstance = {
    referenceKey: string;
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
    reference: ModelReference<T>,
    data: Partial<T>,
}

export type TrailDataModels = {
    [modelName: string]: {
        [key: string]: TrailDataModelItem,
    },
}

export type TrailDataModelPathsMethods<T> = {
    ITEMS: (reference: ModelReference<T>) => string;
    REQUESTS: (reference: ModelReference<T>) => string;
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
    resource: Apify.Dataset;
} & BaseInstance;

export type DatasetOptions = {
    name: string,
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
    input?: any,
    crawlerMode?: RequestCrawlerMode,
    crawler?: CrawlerInstance,
    steps?: StepsInstance<reallyAny, reallyAny>;
    flows?: FlowsInstance;
    models?: ModelsInstance;
    stores?: StoresInstance;
    queues?: QueuesInstance;
    datasets?: DatasetsInstance;
    hooks?: HooksInstance<reallyAny>;
} & BaseInstance;

export type ActorOptions = {
    name?: string,
    crawlerMode?: RequestCrawlerMode,
    crawler?: CrawlerInstance,
    steps?: StepsInstance<reallyAny, reallyAny>;
    flows?: FlowsInstance;
    models?: ModelsInstance;
    stores?: StoresInstance;
    queues?: QueuesInstance;
    datasets?: DatasetsInstance;
    hooks?: HooksInstance<reallyAny>;
}

// hooks.ts ------------------------------------------------------------
export type HooksInstance<Methods = unknown> = {
    [K in DefaultHookNames[number]]: StepInstance<Methods & GeneralStepApi>;
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

export type RequestCrawlerMode = 'ajax' | 'cheerio' | 'browser';

export type RequestMetaData = {
    stepName?: string,
    crawlerMode: RequestCrawlerMode,
    reference?: Partial<ModelReference<any>>,
}

// crawler.ts ------------------------------------------------------------
export type CrawlerInstance<CrawlerType = unknown> = {
    resource: CrawlerType,
} & BaseInstance;

export type CrawlerOptions<CrawlerType = unknown> = {
    resource?: CrawlerType
}

// logger.ts ------------------------------------------------------------
export type LoggerOptions = {
    suffix?: string,
    level?: LogLevel,
}

export type LoggerInstance = {
    elementId: string,
    suffix?: string,
    level?: LogLevel,
    apifyLogger: typeof Apify.utils.log,
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
    handler: (context: CrawlingContext, api: unknown) => Promise<void>,
}

// validator.ts ------------------------------------------------------------
export type ValidatorInstance = {
    name: string,
    schema: any,
};

export type ValidatorOptions = {
    name: string,
    schema: any,
};

export type ValidatorValidateOptions = {
    logError?: boolean,
    throwError?: boolean,
    partial?: boolean,
};
