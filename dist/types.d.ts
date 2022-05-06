/// <reference types="node" />
import Apify, { PlaywrightCrawlerOptions, Request } from 'apify';
import { ApifyClient } from 'apify-client';
import { LogLevel } from 'apify/build/utils_log';
import { IndexOptions, IndexOptionsForDocumentSearch } from 'flexsearch';
import type { JSONSchema7 as $JSONSchema7 } from 'json-schema';
import type { FromSchema } from 'json-schema-to-ts';
import { Readonly } from 'json-schema-to-ts/lib/utils';
import Route from 'route-parser';
import MultiCrawler from './sdk/multi-crawler';
import RequestQueue from './sdk/request-queue';
export type { JSONSchemaType } from 'ajv';
export declare type MakeSchema<S> = S | Readonly<S>;
export declare type JSONSchema = MakeSchema<_JSONSchema7>;
export declare type JSONSchemaWithMethods = MakeSchema<_JSONSchema7<JSONSchemaMethods>>;
export declare type JSONSchemaMethods = {
    organizeList?: (items: TrailDataModelItem[], api: GeneralStepApi) => TrailDataModelItem[] | Promise<TrailDataModelItem[]>;
    isItemUnique?: (existingItem: TrailDataModelItem<ReallyAny>, newItem: TrailDataModelItem<ReallyAny>) => boolean;
    isListComplete?: (items: TrailDataModelItem[], api: GeneralStepApi) => boolean | Promise<boolean>;
};
export declare type JSONSchemaObject<T = unknown> = (Omit<$JSONSchema7, 'const' | 'enum' | 'items' | 'additionalItems' | 'contains' | 'properties' | 'patternProperties' | 'additionalProperties' | 'dependencies' | 'propertyNames' | 'if' | 'then' | 'else' | 'allOf' | 'anyOf' | 'oneOf' | 'not' | 'definitions' | 'examples'> & {
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
} & T);
export declare type _JSONSchema7<T = unknown> = boolean | JSONSchemaObject<T>;
export declare type AnyObject = Record<string, ReallyAny>;
export declare type ReallyAny = any;
export declare type UniqueyKey = string;
export declare type ReferenceKey = string;
export declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export declare type DeepPartial<T> = Partial<{
    [P in keyof T]: DeepPartial<T[P]>;
}>;
export declare type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<Lowercase<U>>>}` : Lowercase<S>;
export declare type SnakeToPascalCase<S extends string> = S extends `${infer T}_${infer U}` ? `${Capitalize<Lowercase<T>>}${SnakeToPascalCase<Capitalize<Lowercase<U>>>}` : Capitalize<Lowercase<S>>;
export declare type WithoutFunctions<T> = {
    [K in keyof T]: T[K] extends (string | number) ? K : never;
};
export declare type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
export declare type GeneralKeyedObject<N extends Record<string, string>, T> = {
    [K in Extract<keyof N, string>]: T;
};
export declare type GenerateObject<N extends string[], T> = {
    [K in N[number]]: T;
};
export declare type ValueOf<T> = T[keyof T];
export declare type RequestSource = import('apify').Request | import('apify').RequestOptions;
export declare type RequestOptionalOptions = {
    priority?: number;
    type?: RequestCrawlerMode;
    forefront?: boolean | undefined;
} | undefined;
export declare type RequestContext = Apify.CheerioHandlePageInputs & Apify.PlaywrightHandlePageFunctionParam & Apify.BrowserCrawlingContext & Apify.CrawlingContext;
export declare type BaseInstance = {
    uid?: string;
    key?: string;
    name: string;
    id: string;
};
export declare type BaseOptions = {
    name?: string;
    key?: string;
    uid?: string;
    id?: string;
};
export declare type FlowsInstance<StepNames = string> = FlowDefinitions<StepNames, ReallyAny>;
export declare type FlowDefinitions<StepNames, T extends Record<string, FlowDefinition<StepNames>>> = {
    [K in keyof T]: T[K] extends FlowDefinition<StepNames> ? T[K] & {
        name: string;
    } : never;
};
export declare type FlowInstance<StepNames> = {
    crawlerMode?: RequestCrawlerMode;
    steps: StepNames[];
    input: ModelInstance<JSONSchema>;
    output: ModelInstance<JSONSchema>;
    actorKey: UniqueyKey | undefined;
} & BaseInstance;
export declare type FlowDefinition<StepNames = string> = {
    crawlerMode?: RequestCrawlerMode;
    steps: StepNames[];
    input: ModelDefinition<JSONSchemaWithMethods>;
    output: ModelDefinition<JSONSchemaWithMethods>;
    actorKey?: UniqueyKey;
};
export declare type FlowNamesObject<F extends Record<string, ReallyAny>> = {
    [K in keyof F]: Extract<K, string>;
};
export declare type FlowOptions<StepNames = string> = FlowDefinition<StepNames> & {
    name: string;
};
export declare type FlowOptionsWithoutName<StepNames = string> = Omit<FlowOptions<StepNames>, 'name'>;
export declare type StepsInstance<M extends Record<string, ModelDefinition>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition> = {
    [K in keyof S]: S[K] extends StepDefinition ? StepInstance<StepApiInstance<F, S, M, I>> & S[K] : never;
};
export declare type StepsOptions<T> = {
    STEPS?: T;
};
export declare type StepDefinitions<T extends Record<string, StepDefinition>> = {
    [K in keyof T]: T[K] extends StepDefinition ? {
        crawlerMode: T[K]['crawlerMode'];
    } : never;
};
export declare type StepDefinition<Methods = unknown> = Partial<Pick<StepInstance<Methods & GeneralStepApi>, 'crawlerMode'>>;
export declare type StepNamesSignature = Record<string, string>;
export declare type StepInstance<Methods = unknown> = {
    name: string;
    crawlerMode?: RequestCrawlerMode;
    handler?: StepOptionsHandler<Methods & GeneralStepApi>;
    errorHandler?: StepOptionsHandler<Methods & GeneralStepApi>;
    requestErrorHandler?: StepOptionsHandler<Methods & GeneralStepApi>;
    afterHandler?: StepOptionsHandler<Methods & GeneralStepApi>;
    beforeHandler?: StepOptionsHandler<Methods & GeneralStepApi>;
    actorKey?: string;
} & BaseInstance;
export declare type StepOptions<Methods = unknown> = {
    name: string;
    crawlerMode?: RequestCrawlerMode;
    handler?: StepOptionsHandler<Methods & GeneralStepApi>;
    errorHandler?: StepOptionsHandler<Methods & GeneralStepApi>;
    requestErrorHandler?: StepOptionsHandler<Methods & GeneralStepApi>;
    afterHandler?: StepOptionsHandler<Methods & GeneralStepApi>;
    beforeHandler?: StepOptionsHandler<Methods & GeneralStepApi>;
    actorKey?: string;
};
export declare type StepOptionsHandler<Methods = unknown> = (context: RequestContext, api: Methods) => Promise<void>;
export declare type StepApiInstance<F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition>, I extends InputDefinition> = GeneralStepApi<I> & StepApiFlowsAPI<F, S, M> & StepApiModelAPI<M>;
export declare type GeneralStepApi<I extends InputDefinition = InputDefinition> = StepApiMetaAPI<I> & StepApiUtilsAPI;
export declare type StepApiFlowsInstance<F extends Record<string, FlowDefinition<keyof S>>, S, M extends Record<string, ModelDefinition>> = {
    handler: (context: RequestContext) => StepApiFlowsAPI<F, S, M>;
};
export declare type StepApiFlowsAPI<F extends Record<string, FlowDefinition<keyof S>>, S, M> = {
    actor(): ActorInstance;
    flows(): Record<string, FlowInstance<ReallyAny>>;
    hooks(): Record<string, StepInstance>;
    steps(): Record<string, StepInstance>;
    isCurrentStep: (stepName: string) => boolean;
    isCurrentFlow: (flowName: string) => boolean;
    isStep: (stepNameToTest: string, stepNameExpected: string) => boolean;
    isFlow: (flowNameToTest: string, flowNameExpected: string) => boolean;
    asFlowName: (flowName: string) => (Extract<keyof F, string> | undefined);
    asStepName: (stepName: string) => (Extract<keyof S, string> | undefined);
    start: <FlowName extends keyof F>(flowName: Extract<FlowName, string>, request: RequestSource, input?: ReallyAny, // FromSchema<F[FlowName]['input']>
    options?: {
        reference?: ModelReference<M>;
        crawlerMode: RequestCrawlerMode | undefined;
        stepName?: string;
        useNewTrail: boolean;
    }) => ModelReference<M>;
    pipe: <FlowName extends keyof F>(flowName: Extract<FlowName, string>, request: RequestSource, input?: ReallyAny, // FromSchema<F[FlowName]['input']>
    options?: {
        reference?: ModelReference<M>;
        crawlerMode: RequestCrawlerMode | undefined;
        useNewTrail: boolean;
    }) => ModelReference<M>;
    next: (stepName: Extract<keyof S, string>, request: RequestSource, reference?: ModelReference<M>, options?: {
        crawlerMode: RequestCrawlerMode;
    }) => void;
    stop: (reference?: ModelReference<M>) => void;
    retry: (reference?: ModelReference<M>) => void;
};
export declare type StepApiModelInstance<M extends Record<string, ModelDefinition>> = {
    handler: (context: RequestContext) => StepApiModelAPI<M>;
};
export declare type KeyedSchemaType<TModels extends Record<string, ModelDefinition>> = {
    [TModelName in keyof TModels]: {
        schema: FromSchema<TModels[TModelName]['schema']>;
    };
};
export declare type StepApiModelAPI<M extends Record<string, ModelDefinition>, N extends Record<string, ReallyAny> = KeyedSchemaType<M>> = {
    add: <ModelName extends keyof N>(modelName: ModelName, value: N[ModelName]['schema'], ref?: ModelReference<M>) => ModelReference<M>;
    addPartial: <ModelName extends keyof N>(modelName: ModelName, value: Partial<N[ModelName]['schema']>, ref?: ModelReference<M>) => ModelReference<M>;
    get: <ModelName extends keyof N>(modelName: ModelName, ref?: ModelReference<M>) => N[ModelName]['schema'];
    update: <ModelName extends keyof N>(modelName: ModelName, value: Partial<N[ModelName]['schema']> | ((previous: Partial<N[ModelName]['schema']>) => Partial<N[ModelName]['schema']>), ref?: ModelReference<M>) => ModelReference<M>;
    updatePartial: <ModelName extends keyof N>(modelName: ModelName, value: Partial<N[ModelName]['schema']> | ((previous: Partial<N[ModelName]['schema']>) => Partial<N[ModelName]['schema']>), ref?: ModelReference<M>) => ModelReference<M>;
};
export declare type StepApiMetaInstance = {
    handler: (context: RequestContext) => StepApiMetaAPI;
};
export declare type StepApiMetaAPI<I extends InputDefinition = InputDefinition> = {
    getActorInput: () => ReallyAny | FromSchema<I['schema']>;
    getUserData: () => Record<string, unknown>;
    getMetaData: () => RequestMetaData;
    getRerence: () => RequestMetaData['reference'];
    getFlowInput: () => TrailFlowState['input'];
    getFlowName: () => string;
    getStepName: () => string;
};
export declare type StepApiUtilsInstance = {
    handler: (context: RequestContext) => StepApiUtilsAPI;
};
export declare type StepApiUtilsAPI = {
    absoluteUrl: (url: string) => string | void;
};
export declare type ModelsInstance<T> = T;
export declare type ModelDefinitions<T extends Record<string, ModelDefinition>> = T;
export declare type ModelInstance<TSchema = JSONSchema> = ModelDefinition<TSchema> & BaseInstance;
export declare type ModelDefinition<TSchema = JSONSchema> = {
    name?: string;
    schema: TSchema;
    parentType?: string;
    parentKey?: string;
    parents?: string[];
};
export declare type ModelOptions<TSchema = JSONSchema> = ModelDefinition<TSchema>;
export declare type ModelReference<T = unknown> = Partial<{
    [K in Extract<keyof T, string> as `${SnakeToCamelCase<K>}Key`]: UniqueyKey;
} & {
    fRequestKey: UniqueyKey;
    fTrailKey: UniqueyKey;
    fFlowKey: UniqueyKey;
    fActorKey: UniqueyKey;
}>;
export declare type StoresInstance<DataStoreNames extends string[] = DefaultDataStoreNames, FileStoreNames extends string[] = DefaultFileStoreNames> = GenerateObject<FileStoreNames & DefaultFileStoreNames, FileStoreInstance> & GenerateObject<DataStoreNames & DefaultDataStoreNames, DataStoreInstance>;
export declare type StoreInstance = DataStoreInstance | FileStoreInstance;
export declare type DefaultDataStoreNames = ['state', 'trails', 'incorrectDataset'];
export declare type DefaultFileStoreNames = ['files', 'responseBodies', 'browserTraces'];
export declare type StoresOptions<DataStoreNames extends string[] = [], FileStoreNames extends string[] = []> = {
    dataStoreNames?: Extract<ValueOf<DataStoreNames>, string>[];
    fileStoreNames?: Extract<ValueOf<FileStoreNames>, string>[];
};
export declare type DataStoreInstance = {
    type: 'data-store';
    kvKey: string;
    pathPrefix: string;
    splitByKey?: boolean;
    initialized: boolean;
    state: Record<string, unknown>;
} & BaseInstance;
export declare type DataStoreOptions = {
    name: string;
    key?: string;
    kvKey?: string;
    splitByKey?: boolean;
    pathPrefix?: string;
};
export declare type FileStoreInstance = {
    type: 'file-store';
    kvKey: string;
    resource: Apify.KeyValueStore | undefined;
    initialized: boolean;
} & BaseInstance;
export declare type FileStoreOptions = {
    name: string;
    kvKey?: string;
    key?: string;
};
export declare type TrailInstance = {
    id: string;
    store: DataStoreInstance;
    models: ModelsInstance<ReallyAny>;
};
export declare type TrailOptions = {
    id?: string;
    actor?: ActorInstance;
};
export declare type TrailFlowState = {
    name: string;
    input: any;
    reference: ModelReference<ReallyAny> | undefined;
    crawlerMode?: RequestCrawlerMode;
    output?: any;
};
export declare type TrailState = {
    id: string;
    flows: {
        [flowKey: string]: TrailFlowState;
    };
    stats: {
        startedAt: string;
        endedAt: string;
        retries: number;
        sizeInKb: number;
        aggregatedDurationInMs: number;
    };
    ingested: TrailDataStage;
    digested: TrailDataStage;
    output: any;
};
export declare type TrailsOptions = {
    actor: ActorInstance;
    store?: DataStoreInstance;
};
export declare type TrailsInstance = {
    actor: ActorInstance;
    store: DataStoreInstance;
} & BaseInstance;
export declare type TrailDataStages = 'digested' | 'ingested';
export declare type TrailDataStage = {
    models: Record<string, TrailDataModelInstance>;
    requests: TrailDataRequestsInstance;
};
export declare type TrailDataInstance = TrailDataModelInstance | TrailDataRequestsInstance;
export declare type TrailDataRequestsInstance = {
    id: UniqueyKey;
    referenceKey: ReferenceKey;
    store: DataStoreInstance;
    path: string;
} & BaseInstance;
export declare type TrailDataRequestsOptions = {
    id: UniqueyKey;
    type: TrailDataStages;
    store: DataStoreInstance;
};
export declare type TrailDataRequestItemStatus = 'CREATED' | 'DISCARDED' | 'QUEUED' | 'STARTED' | 'SUCCEEDED' | 'FAILED';
export declare type TrailDataModelItemStatus = 'CREATED' | 'PUSHED' | 'DISCARDED';
export declare type TrailDataRequestItem = {
    id: UniqueyKey;
    source: RequestSource;
    snapshot: RequestSource | undefined;
    status: TrailDataRequestItemStatus;
};
export declare type TrailDataModelInstance = {
    referenceKey: ReferenceKey;
    id: UniqueyKey;
    path: string;
    model: ModelInstance;
    store: DataStoreInstance;
} & BaseInstance;
export declare type TrailDataModelOptions = {
    id: UniqueyKey;
    type: TrailDataStages;
    model: ModelInstance;
    store: DataStoreInstance;
};
export declare type TrailDataModelItem<T = unknown> = {
    id: UniqueyKey;
    model: string;
    reference: ModelReference<T>;
    data: Partial<T>;
    partial: boolean;
    operations: TrailDataModelOperation[];
    status: TrailDataModelItemStatus;
};
export declare type TrailDataModelOperation = {
    data: any;
    op: 'SET' | 'SET_PARTIAL' | 'UPDATE' | 'UPDATE_PARTIAL';
    at: string;
};
export declare type TrailDataModels = {
    [modelName: string]: {
        [key: string]: TrailDataModelItem;
    };
};
export declare type TrailModelPathsOptions = {
    name: string;
    path: TrailDataStages;
};
export declare type QueueInstance = {
    resource?: RequestQueue;
} & BaseInstance;
export declare type QueueOptions = {
    name?: string;
};
export declare type QueuesInstance<Names extends string[] = []> = GenerateObject<Names | DefaultQueueNames, StepInstance>;
export declare type QueuesOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[];
};
export declare type DefaultQueueNames = ['default'];
export declare type DatasetInstance = {
    name: string;
    resource: Apify.Dataset | undefined;
} & BaseInstance;
export declare type DatasetOptions = {
    name?: string;
};
export declare type DatasetsInstance<Names extends string[] = []> = GenerateObject<Names | DefaultDatasetNames, DatasetInstance>;
export declare type DatasetsOptions<Names extends string[] = []> = {
    names?: Names;
};
export declare type DefaultDatasetNames = ['default'];
export declare type ActorInstance = {
    name: string;
    crawlerMode?: RequestCrawlerMode;
    crawlerOptions?: ActorCrawlerOptions;
    input: InputInstance;
    crawler: CrawlerInstance;
    steps: StepsInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
    flows: FlowsInstance<ReallyAny>;
    models: ModelsInstance<ReallyAny>;
    stores: StoresInstance;
    queues: QueuesInstance;
    datasets: DatasetsInstance;
    hooks: HooksInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
} & BaseInstance;
export declare type ActorOptions = {
    name: string;
    input?: InputInstance;
    crawlerMode?: RequestCrawlerMode;
    crawlerOptions?: ActorCrawlerOptions;
    crawler?: CrawlerInstance;
    steps?: StepsInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
    flows?: FlowsInstance<ReallyAny>;
    models?: ModelsInstance<ReallyAny>;
    stores?: StoresInstance;
    queues?: QueuesInstance;
    datasets?: DatasetsInstance;
    hooks?: HooksInstance<ReallyAny, ReallyAny, ReallyAny, ReallyAny>;
};
export declare type ActorInput = string | {
    [x: string]: any;
} | Buffer | null;
export declare type ActorCrawlerOptions = PlaywrightCrawlerOptions;
export declare type HooksInstance<M extends Record<string, ModelDefinition>, F extends Record<string, FlowDefinition<keyof S>>, S, I extends InputDefinition> = {
    [K in DefaultHookNames[number]]: StepInstance<StepApiInstance<F, S, M, I>>;
};
export declare type DefaultHookNames = [
    'FLOW_STARTED',
    'FLOW_ENDED',
    'STEP_STARTED',
    'STEP_ENDED',
    'STEP_FAILED',
    'STEP_REQUEST_FAILED',
    'ACTOR_STARTED',
    'ACTOR_ENDED',
    'QUEUE_STARTED',
    'QUEUE_ENDED'
];
export declare type GenerateHookFireMethods<T extends string[]> = {
    [K in T[number] as `fire${SnakeToPascalCase<K>}`]: (request: RequestSource) => void;
};
export declare type HookMethods = GenerateHookFireMethods<DefaultHookNames>;
export declare type RequestMetaInstance = {
    request: Request;
    userData: Record<string, unknown>;
    data: RequestMetaData;
} & BaseInstance;
export declare type RequestMetaOptions = {
    nothing?: string;
};
export declare type RequestCrawlerMode = 'http' | 'chromium' | 'firefox' | 'webkit';
export declare type RequestMetaData = {
    isHook: boolean;
    stepStop: boolean;
    flowStop: boolean;
    flowStart: boolean;
    flowName: string;
    stepName: string;
    crawlerMode: RequestCrawlerMode;
    reference: Partial<ModelReference<any>>;
};
export declare type CrawlerInstance = {
    launcher?: MultiCrawler | ReallyAny;
    crawlerOptions?: Partial<PlaywrightCrawlerOptions>;
} & BaseInstance;
export declare type CrawlerOptions = {
    launcher?: MultiCrawler | ReallyAny;
    crawlerOptions?: Partial<PlaywrightCrawlerOptions>;
};
export declare type LoggerOptions = {
    suffix?: string;
    level?: LogLevel;
};
export declare type LogMethods = 'info' | 'warning' | 'error' | 'debug' | 'perf';
export declare type LoggerInstance = {
    elementId: string;
    suffix?: string;
    level?: LogLevel;
    apifyLogger: import('@apify/log/log').Log;
};
export declare type ApifyClientInstance = {
    resource: ApifyClient;
};
export declare type ApifyClientOptions = {
    token?: string;
};
export declare type OrchestratorInstance = {
    handler: (context: RequestContext, api: unknown) => Promise<void>;
};
export declare type ValidatorInstance = {
    name: string;
    schema: JSONSchema;
};
export declare type ValidatorOptions = {
    name: string;
    schema: JSONSchema;
};
export declare type ValidatorValidateOptions = {
    logError?: boolean;
    throwError?: boolean;
    partial?: boolean;
};
export declare type InputInstance<TSchema extends JSONSchema = {
    type: 'object';
}> = {
    data: ReallyAny | undefined;
    schema: TSchema;
};
export declare type InputDefinition<TSchema extends JSONSchema = {
    type: 'object';
}> = {
    schema: TSchema;
};
export declare type SearchInstance = {
    indexOptions: IndexOptions<string, false>;
    documentOptions: IndexOptionsForDocumentSearch<unknown, false>;
} & BaseInstance;
export declare type SearchOptions = {
    name?: string;
    indexOptions?: IndexOptions<string, false>;
    documentOptions?: IndexOptionsForDocumentSearch<unknown, false>;
};
export declare type UrlPatternInstance = {
    pattern: string;
    resource: Route;
} & BaseInstance;
export declare type UrlPatternOptions = {
    name?: string;
    pattern: string;
};
export declare type UrlPatternParsed = {
    origin?: string;
    searchParams?: Record<string, string | number>;
    pathParams?: Record<string, string | number>;
};
//# sourceMappingURL=types.d.ts.map