/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheerioCrawlingContext } from '@crawlee/cheerio';
import { CrawlingContext, Dataset, KeyValueStore, Request, RequestOptions } from '@crawlee/core';
import { PlaywrightCrawlingContext } from '@crawlee/playwright';
import { ApifyClient } from 'apify-client';
import type EventEmitter from 'eventemitter3';
import type { IndexOptions, IndexOptionsForDocumentSearch } from 'flexsearch';
import type { JSONSchema7 as $JSONSchema7 } from 'json-schema';
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

export type DeepModelsOmitter<V> = V extends { modelName: string }
    ? never : (V extends Record<string, any> ? { [K in keyof V]: DeepModelsOmitter<V[K]> } : V);

export type DeepOmitModels<T> = {
    [K in keyof T]: DeepModelsOmitter<T[K]>
}

export type ExcludeKeysWithTypeOf<T, V> = Pick<T, { [K in keyof T]: Exclude<T[K], undefined> extends V ? never : K }[keyof T]>;

// apify --------------------------------------------------
export type RequestSource = Request | RequestOptions
export type RequestOptionalOptions = { priority?: number, crawlerOptions?: RequestCrawlerOptions, forefront?: boolean | undefined } | undefined
export type RequestContext = CrawlingContext & PlaywrightCrawlingContext & CheerioCrawlingContext

// shared --------------------------------------------------
export type RequestCrawlerMode = 'http' | 'chromium' | 'firefox' | 'webkit';

export type RequestCrawlerOptions = {
    mode: RequestCrawlerMode
};

export type SharedMetaContext = {
    flowName?: string,
    stepName?: string,
    actorKey?: string,
    trailKey?: string,
    flowKey?: string,
    requestKey?: string,
}

export type SharedCustomCrawlerOptions = {
    crawlerMode?: RequestCrawlerMode,
    crawlerOptions?: RequestCrawlerOptions,
}

// @usefelps/instance-base ------------------------------------------------------------
export type InstanceBase = {
    uid?: string,
    key?: string,
    name: string,
    id: string,
};

export type InstanceBaseOptions = {
    name?: string,
    key?: string,
    uid?: string,
    id?: string,
}

// @usefelps/flow ------------------------------------------------------------

export type FlowInstance<
    FlowNames extends string = string,
    StepNames extends string = string
> = {
    name: FlowNames,
    steps: StepNames[],
    context?: SharedMetaContext,
} & SharedCustomCrawlerOptions & Omit<InstanceBase, 'name'>;

export type FlowOptions<
    FlowNames extends string = string,
    StepNames extends string = string
> = {
    name: FlowNames,
    steps?: StepNames[],
    context?: SharedMetaContext,
} & SharedCustomCrawlerOptions

// @usefelps/step ------------------------------------------------------------
export type StepInstance<StepNames extends string = string> = {
    name: StepNames,
    hooks?: StepHooks,
    context?: SharedMetaContext,
}
    & SharedCustomCrawlerOptions
    & Omit<InstanceBase, 'name'>;

export type StepOptions<StepNames extends string = string> = Omit<StepInstance<StepNames>, keyof InstanceBase> & { name: StepNames };

export type StepHooks<Methods = any> = {
    navigationHook?: HookOptions<StepOptionsHandlerParameters<Methods & GeneralContextApi>>,
    postNavigationHook?: HookOptions<StepOptionsHandlerParameters<Methods & GeneralContextApi>>,
    preNavigationHook?: HookOptions<StepOptionsHandlerParameters<Methods & GeneralContextApi>>,
    onErrorHook?: HookOptions<[context: RequestContext, api: Methods & GeneralContextApi, error: ReallyAny]>,
    onRequestErrorHook?: HookOptions<StepOptionsHandlerParameters<Methods & GeneralContextApi>>
};
export type StepOptionsHandlerParameters<Methods = any> = [context: RequestContext, api: Methods]
export type StepOptionsHandler<Methods = unknown> = (context: RequestContext, api: Methods) => Promise<void>

// @usefelps/context-api ------------------------------------------------------------
export type GeneralContextApi = ContextApiMetaAPI & ContextApiHelpersAPI;


// @usefelps/context-flow ------------------------------------------------------------
export type ContextApiFlowsInstance = {
    handler: (context: RequestContext) => ContextApiFlowsAPI
};

export type ContextApiFlowsAPI = {
    currentStep(): string,
    currentFlow(): string,
    isCurrentStep: (stepName: string) => boolean,
    isCurrentFlow: (flowName: string) => boolean,
    isCurrentActor: (actorKey: string) => boolean,
    isStep: (stepNameToTest: string, stepNameExpected: string) => boolean,
    isFlow: (flowNameToTest: string, flowNameExpected: string) => boolean,
    isSomeStep: (stepNameToTest: string, stepNamesExpected: (string)[]) => boolean,
    isSomeFlow: (flowNameToTest: string, flowNamesExpected: (string)[]) => boolean,
    asFlowName: (flowName: string) => (string | undefined),
    asStepName: (stepName: string) => (string | undefined),
    start: (
        flowName: string,
        request: RequestSource,
        input?: ReallyAny,
        options?: {
            stepName?: string,
            crawlerOptions?: RequestCrawlerOptions | undefined,
            useNewTrail?: boolean
        }
    ) => void;
    paginate: (request: RequestSource, options?: { crawlerOptions?: RequestCrawlerOptions }) => void;
    next: (stepName: Extract<string, string>, request: RequestSource, options?: { crawlerOptions?: RequestCrawlerOptions }) => void;
    stop: () => void;
    retry: () => void;
};

// @usefelps/context-api--meta ------------------------------------------------------------
export type ContextApiMetaInstance = {
    handler: (context: RequestContext) => ContextApiMetaAPI,
};

export type ContextApiMetaAPI = {
    getActorName: () => string | undefined;
    getActorInput: () => ReallyAny,
    getUserData: () => Record<string, unknown>,
    getMetaData: () => RequestMetaData,
    getFlowInput: () => any;
    getFlowName: () => string;
    getStepName: () => string;
}

// @usefelps/context-api--helpers ------------------------------------------------------------
export type ContextApiHelpersInstance = {
    handler: (context: RequestContext) => ContextApiHelpersAPI,
};

export type ContextApiHelpersAPI = {
    absoluteUrl: (url: string) => string | undefined,
}

// stores.ts ------------------------------------------------------------
// eslint-disable-next-line max-len
// export type StoreCollectionInstance<StateNames extends string[] = DefaultStateNames, BucketNames extends string[] = DefaultBucketNames> = GenerateObject<BucketNames & DefaultBucketNames, BucketInstance> & GenerateObject<StateNames & DefaultStateNames, StateInstance>;

// export type StoreInstance = StateInstance | BucketInstance;

// export type DefaultStateNames = ['state', 'trails', 'incorrectDataset']
// export type DefaultBucketNames = ['cachedRequests', 'files', 'responseBodies', 'browserTraces']

// export type StoreCollectionOptions = {
//     dataStores?: StateOptions[],
//     fileStores?: BucketOptions[],
//     // dataStoreNames?: Extract<ValueOf<StateNames>, string>[],
//     // fileStoreNames?: Extract<ValueOf<BucketNames>, string>[],
//     dataStoreAdapter?: KVStoreAdapterInstance,
//     fileStoreAdapter?: KVStoreAdapterInstance,
// }

export type StorageStatistics = {
    reads: number,
    writes: number
}

// stores ------------------------------------------------------------
export type AnyStoreLike = StateInstance | BucketInstance;


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
} & InstanceBase;

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
} & InstanceBase;

export type BucketOptions = {
    name: string,
    kvKey?: string,
    key?: string,
}

// trail.ts ------------------------------------------------------------
// export type TrailInstance = {
//     id: string;
//     store: StateInstance;
//     models: ModelsInstance<ReallyAny>;
// };

// export type TrailOptions = {
//     id?: string;
//     store?: StateInstance;
//     actor?: ActorInstance;
// }

// export type TrailFlowState = {
//     name: string,
//     input: any,
//     reference: ModelReference<ReallyAny> | undefined,
//     crawlerOptions?: RequestCrawlerOptions,
//     output?: any,
// }

// export type TrailState = {
//     id: string,
//     flows: {
//         [flowKey: string]: TrailFlowState,
//     },
//     stats: {
//         startedAt: string,
//         endedAt: string,
//         retries: number,
//         sizeInKb: number,
//         aggregatedDurationInMs: number,
//     },
//     ingested: TrailDataStage,
//     digested: TrailDataStage,
//     output: any,
// }

// // trails.ts
// export type TrailsOptions = {
//     actor: ActorInstance,
//     store?: StateInstance,
// };

// export type TrailsInstance = {
//     actor: ActorInstance,
//     store: StateInstance,
// } & InstanceBase;

// // trail-data.ts
// export type TrailDataStages = 'digested' | 'ingested';

// export type TrailDataStage = {
//     models: Record<string, TrailDataModelInstance>,
//     requests: TrailDataRequestsInstance,
// }

// export type TrailDataInstance = TrailDataModelInstance | TrailDataRequestsInstance;

// // trail-data-requests.ts
// export type TrailDataRequestsInstance = {
//     id: UniqueyKey,
//     referenceKey: ReferenceKey;
//     store: StateInstance;
//     path: string;
// } & InstanceBase;

// export type TrailDataRequestsOptions = {
//     id: UniqueyKey,
//     type: TrailDataStages,
//     store: StateInstance;
// }

// export type TrailDataRequestItemStatus = 'CREATED' | 'DISCARDED' | 'QUEUED' | 'STARTED' | 'SUCCEEDED' | 'FAILED';
// export type TrailDataModelItemStatus = 'CREATED' | 'PUSHED' | 'DISCARDED';

// export type TrailDataRequestItem = {
//     id: UniqueyKey,
//     source: RequestSource,
//     snapshot: RequestSource | undefined,
//     status: TrailDataRequestItemStatus,
// }

// @usefelps/request-queue ------------------------------------------------------------
export type RequestQueueInstance = {
    resource?: ReallyAny, // RequestQueue
} & InstanceBase;

export type RequestQueueOptions = {
    name?: string,
}

// @usefelps/dataset ------------------------------------------------------------
export type DatasetInstance = {
    name: string;
    hooks: DatasetHooks;
    resource: Dataset | undefined;
} & InstanceBase;

export type DatasetHooks = {
    preDataPushedHook: HookInstance<[dataset: DatasetInstance, data: ReallyAny | ReallyAny[]]>
    onDataPushFailedHook: HookInstance<[dataset: DatasetInstance, data: ReallyAny | ReallyAny[], error: ReallyAny]>
    postDataPushedHook: HookInstance<[dataset: DatasetInstance, data: ReallyAny | ReallyAny[]]>
};

export type DatasetOptions = {
    name?: string,
    hooks?: DatasetHooks
}

// @usefelps/actor ------------------------------------------------------------
export type ActorInstance<
    ITCrawler extends CrawlerInstance = ReallyAny,
    ITStores extends Array<AnyStoreLike> = ReallyAny,
    ITQueues extends Array<RequestQueueInstance> = ReallyAny,
    ITDatasets extends Array<DatasetInstance> = ReallyAny,
    ITFlows extends Array<FlowInstance> = ReallyAny,
    ITSteps extends Array<StepInstance> = ReallyAny,
    ITContextApi extends Array<GeneralContextApi> = ReallyAny,
> = ActorInstanceBase<
    ITCrawler,
    ITStores,
    ITQueues,
    ITDatasets,
    ITFlows,
    ITSteps,
    ITContextApi
> & InstanceBase;

export type ActorInstanceBase<
    ITCrawler extends CrawlerInstance,
    ITStores extends Array<AnyStoreLike>,
    ITQueues extends Array<RequestQueueInstance>,
    ITDatasets extends Array<DatasetInstance>,
    ITFlows extends Array<FlowInstance>,
    ITSteps extends Array<StepInstance>,
    ITContextApi extends Array<GeneralContextApi>,
> = {
    name: string,
    crawler: ITCrawler,
    steps: ITSteps;
    contextApi: ITContextApi,
    flows: ITFlows;
    stores: ITStores;
    queues: ITQueues;
    datasets: ITDatasets;
    hooks: ActorHooks<
        ITCrawler,
        ITStores,
        ITQueues,
        ITDatasets,
        ITFlows,
        ITSteps,
        ITContextApi
    >;
} & SharedCustomCrawlerOptions;

export type ActorOptions<
    ITCrawler extends CrawlerInstance,
    ITStores extends Array<AnyStoreLike>,
    ITQueues extends Array<RequestQueueInstance>,
    ITDatasets extends Array<DatasetInstance>,
    ITFlows extends Array<FlowInstance>,
    ITSteps extends Array<StepInstance>,
    ITContextApi extends Array<GeneralContextApi>,
> = Partial<
    ActorInstanceBase<
        ITCrawler,
        ITStores,
        ITQueues,
        ITDatasets,
        ITFlows,
        ITSteps,
        ITContextApi
    >
>;

export type ActorHooks<
    ITCrawler extends CrawlerInstance,
    ITStores extends Array<AnyStoreLike>,
    ITQueues extends Array<RequestQueueInstance>,
    ITDatasets extends Array<DatasetInstance>,
    ITFlows extends Array<FlowInstance>,
    ITSteps extends Array<StepInstance>,
    ITContextApi extends Array<GeneralContextApi>,
    LocalActorInstance = ActorInstance<
        ITCrawler,
        ITStores,
        ITQueues,
        ITDatasets,
        ITFlows,
        ITSteps,
        ITContextApi>
> = {
    preActorStartedHook?: HookInstance<[actor: LocalActorInstance, input: ActorInput]>,
    postActorEndedHook?: HookInstance<[actor: LocalActorInstance]>,
    preCrawlerStartedHook?: HookInstance<[actor: LocalActorInstance]>,
    postCrawlerEndedHook?: HookInstance<[actor: LocalActorInstance]>,
    onCrawlerFailedHook?: HookInstance<[actor: LocalActorInstance, error: ReallyAny]>,
    preQueueStartedHook?: HookInstance<[actor: LocalActorInstance]>,
    postQueueEndedHook?: HookInstance<[actor: LocalActorInstance]>,
    preFlowStartedHook?: HookInstance<[actor: LocalActorInstance]>,
    postFlowEndedHook?: HookInstance<[actor: LocalActorInstance]>,
    preStepStartedHook?: HookInstance<[actor: LocalActorInstance, context: RequestContext]>,
    postStepEndedHook?: HookInstance<[actor: LocalActorInstance, context: RequestContext]>,
    onStepFailedHook?: HookInstance<[actor: LocalActorInstance, error: ReallyAny]>,
    onStepRequestFailedHook?: HookInstance<[actor: LocalActorInstance, error: ReallyAny]>,
}

export type ActorInput = string | {
    [x: string]: any;
} | Buffer | null;

// @usefelps/context-api--meta ------------------------------------------------------------
export type RequestMetaInstance = {
    request: Request | RequestSource,
    userData: Record<string, unknown>,
    data: RequestMetaData,
} & InstanceBase;

export type RequestMetaData = {
    isHook: boolean,
    stepStop: boolean,
    flowStop: boolean,
    flowStart: boolean,
    context: SharedMetaContext,
    crawlerOptions?: RequestCrawlerOptions,
}

// crawler.ts ------------------------------------------------------------
export type CrawlerInstance = {
    launcher?: ReallyAny, // MultiCrawler |
    resource: undefined, // MultiCrawler |
} & InstanceBase;

export type CrawlerOptions = {
    launcher?: ReallyAny, //  MultiCrawler |
}

export type LogMethods = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug';
export type LogLevels<LevelNames extends string = LogMethods> = Record<LevelNames, number>;

// @usefelps/logger ------------------------------------------------------------
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

// @usefelps/validator ------------------------------------------------------------
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

// // input.ts ------------------------------------------------------------
// export type InputInstance<TSchema extends JSONSchema = ReallyAny> = {
//     data: ReallyAny | undefined, // FromSchema<TSchema>
//     schema: TSchema,
// };

// export type InputDefinition<TSchema extends JSONSchema = ReallyAny> = {
//     schema: TSchema,
// };

// search.ts ------------------------------------------------------------
export type SearchInstance = {
    indexOptions: IndexOptions<string, false>,
    documentOptions: IndexOptionsForDocumentSearch<unknown, false>,
} & InstanceBase;

export type SearchOptions = {
    name?: string,
    indexOptions?: IndexOptions<string, false>,
    documentOptions?: IndexOptionsForDocumentSearch<unknown, false>,
}

// url-pattern.ts ------------------------------------------------------------
export type UrlPatternInstance = {
    pattern: string,
    resource: Route,
} & InstanceBase;

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
} & InstanceBase;

// kv-store-adapter.ts
export type KVStoreAdapterInstance<T = ReallyAny> = KVStoreAdapterOptions<T>
    & InstanceBase;

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
export type LoggerAdapterInstance = LoggerAdapterOptions & InstanceBase;

export type LoggerAdapterOptions = {
    name: string,
    adapter: Transport,
}

// @usefelps/hook ------------------------------------------------------------

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
} & Partial<InstanceBase>;
