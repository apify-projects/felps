/* eslint-disable @typescript-eslint/no-explicit-any */
import type Apify from 'apify';
import { CrawlingContext } from 'apify';
import { LogLevel } from 'apify/build/utils_log';
import type { JSONSchema7 } from 'json-schema';
import { DefaultCrawler } from '../functional/crawler';


export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;
export type SnakeToCamelCase<S extends string> =
    S extends `${infer T}_${infer U}` ?
    `${Lowercase<T>}${Capitalize<SnakeToCamelCase<Lowercase<U>>>}` :
    S;
export type SnakeToPascalCase<S extends string> =
    S extends `${infer T}_${infer U}` ?
    `${Capitalize<Lowercase<T>>}${SnakeToPascalCase<Capitalize<Lowercase<U>>>}` :
    S;
export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
export type GenerateObject<N extends string[], T> = { [K in N[number]]: T };
export type ValueOf<T> = T[keyof T];
export type ExtendActor<T> = Actor & T;
export type GenerateMethods<
    Prefix extends string,
    T extends string[],
    Signature = () => void,
    Suffix extends string = '',
    > = { [K in T[number]as `${Prefix}${Capitalize<K>}${Suffix}`]: Signature };

// apify --------------------------------------------------
export type RequestSource = import('apify').Request | import('apify').RequestOptions
export type RequestOptionalOptions = { forefront?: boolean | undefined } | undefined
export type RequestContext = Apify.CheerioHandlePageInputs & Apify.PlaywrightHandlePageFunctionParam & Apify.BrowserCrawlingContext & Apify.CrawlingContext

// base.ts ------------------------------------------------------------
export type BaseOptions = {
    name: string,
    key?: string,
    uid?: string,
    id?: string,
}

export type BaseInstance = {
    uid?: string,
    key?: string,
    name: string,
    id: string,
};

// flows.ts ------------------------------------------------------------
export type FlowsInstance<Names extends string[] = []> = GenerateObject<Names, FlowInstance>;

export type FlowsOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

export type GenerateFlowSetMethods<FlowNames> = {
    [K in Extract<FlowNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<FlowOptions>) => void;
};
// flow.ts ------------------------------------------------------------
export type FlowInstance = {
    steps: StepInstance[],
    output: JSONSchema7,
} & BaseInstance;

export type FlowOptions = {
    name: string,
    steps?: Step[],
    output?: JSONSchema7,
}

// steps.ts
export type StepsInstance<Names extends string[] = []> = GenerateObject<Names, StepInstance>;

export type StepsOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

export type StepOnMethods<StepType extends string, MethodsByStep extends Record<string, unknown>> = MethodsByStep[StepType];

export type GenerateStepOnMethods<StepNames, Methods, MethodsByStep extends Record<string, unknown>> = {
    [K in Extract<StepNames, string> as `${SnakeToCamelCase<K>}`]: (handler: StepOptionsHandler<StepOnMethods<K, MethodsByStep> & Methods>) => void;
};

export type GenerateStepSetMethods<StepNames, InitialMethods, MethodsByStep extends Record<string, unknown>> = {
    [K in Extract<StepNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<StepOptions<InitialMethods, StepOnMethods<K, MethodsByStep>>>) => void;
};

// step.ts ------------------------------------------------------------
export type StepOptions<InitialMethods = unknown, Methods = unknown> = {
    name: string,
    handler?: StepOptionsHandler<InitialMethods & Methods>,
    // controlHandler?: StepOptionsHandler<InitialMethods & Methods>,
    errorHandler?: StepOptionsHandler<InitialMethods & Methods>,
    requestErrorHandler?: StepOptionsHandler<InitialMethods & Methods>,
    // extendStepApi?: StepCustomApiExtend<InitialMethods, Methods>,
    // stepApi?: StepCustomApi<InitialMethods, Methods>,
}

export type StepInstance<Methods = unknown> = {
    name: string,
    handler?: StepOptionsHandler<Methods>,
    // controlHandler?: StepOptionsHandler<Methods>,
    errorHandler?: StepOptionsHandler<Methods>,
    requestErrorHandler?: StepOptionsHandler<Methods>,
} & BaseInstance;

export type StepOptionsHandler<Methods = unknown> = (context: RequestContext, api: Methods) => Promise<void>

export type GenerateStepGotoMethods<T, ModelDefinitions extends Record<string, unknown> = Record<string, unknown>> = {
    [K in Extract<T, string> as `goto${SnakeToPascalCase<K>}`]: (request: RequestSource, references: References<ModelDefinitions>) => void;
};

export type GenerateStepMethods<T, ModelDefinitions extends Record<string, unknown> = Record<string, unknown>> = GenerateStepGotoMethods<T, ModelDefinitions>;

// step-api-meta.ts ------------------------------------------------------------
export type StepApiMetaInstance = {
    handler: (context: CrawlingContext) => {
        getUserData: () => Record<string, unknown>,
        getMetaData: () => RequestMetaData,
        getReferences: () => RequestMetaData['references'],
    },
};

// step-api-utils.ts ------------------------------------------------------------
export type StepApiUtilsInstance = {
    handler: (context: CrawlingContext) => {
        absoluteUrl: (url: string) => string | void,
    },
};

// step-base-api.ts ------------------------------------------------------------
export type StepBaseApiInstance<ModelDefinitions = unknown, Context extends MakeStepBaseApiContext = MakeStepBaseApiContext> = {
    handler: (context: CrawlingContext) => StepBaseApiMethodsDefinition<ModelDefinitions, Context>
} & BaseInstance;

export type StepBaseApiOptions = {
    input: any,
    step: StepInstance,
    stores: StoresInstance,
    datasets: DatasetsInstance,
    queues: QueuesInstance,
}

export type StepBaseApiMethods<
    ModelDefinitions = unknown,
    Context extends MakeStepBaseApiContext = MakeStepBaseApiContext
    > = StepBaseApiMethodsDefinition<ModelDefinitions, Context> & HookMethods;

export type StepBaseApiMethodsDefinition<ModelDefinitions = unknown, Context extends MakeStepBaseApiContext = MakeStepBaseApiContext> = {
    // main api
    step: Context['step'],
    stores: Context['stores'],
    datasets: Context['datasets'],
    queues: Context['queues'],
    // accessors
    getInput: () => Context['input'],
    getStep: () => string,
    getUserData: () => any,
    getReferences: () => Partial<References<any>>,
    // trail
    trail: Trail<ModelDefinitions>,
    // common
    log: Logger,
    // utils
    absoluteUrl(path: string): string | void,
}

export type MakeStepBaseApiContext<
    Input = unknown,
    StepType = StepInstance,
    StoreNames extends string[] = [],
    DatasetNames extends string[] = [],
    QueueNames extends string[] = [],
    ModelDefinitions extends Record<string, unknown> = Record<string, unknown>,
    > = {
        input: Input,
        step: StepType,
        queues: GenerateObject<QueueNames & DefaultQueueNames, Queue>,
        stores: GenerateObject<StoreNames & DefaultStoreNames, AnyStore>;
        datasets: GenerateObject<DatasetNames & DefaultDatasetNames, Dataset>,
        models: Models<ModelDefinitions>,
    };

// step-custom-api.ts ------------------------------------------------------------
export type StepCustomApiOptions<InitialMethods = unknown, Methods = unknown> = {
    extend: StepCustomApiExtend<InitialMethods, Methods>,
}

export type StepCustomApiExtend<
    InitialMethods = unknown,
    Methods = unknown
    > = (crawlingContext: RequestContext, api: Without<InitialMethods, Methods>) => Methods

export type References<T> = {
    [K in Extract<keyof T, string> as `${K}Key`]: string;
} & { requestKey: string };

// models.ts ------------------------------------------------------------
export type ModelsInstance<ModelDefinitions = Record<string, never>> = GenerateObject<Extract<keyof ModelDefinitions, string>[], Model>

export type ModelsOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

export type GenerateModelSetMethods<ModelNames> = {
    [K in Extract<ModelNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<ModelOptions>) => void;
};

// model.ts ------------------------------------------------------------
export type ModelInstance = {
    schema: JSONSchema7,
} & BaseInstance;

export type ModelOptions = {
    name: string,
    schema?: JSONSchema7,
}

export type GenerateModelAddMethods<T extends Record<string, unknown>> = {
    [K in Extract<keyof T, string> as `add${Capitalize<K>}`]: (value: T[K], ref?: Partial<References<T>>) => Partial<References<T>>;
};

export type GenerateModelAddPartialMethods<T extends Record<string, unknown>> = {
    [K in Extract<keyof T, string> as `add${Capitalize<K>}Partial`]: (value: Partial<T[K]>, ref?: Partial<References<T>>) => Partial<References<T>>;
};

export type GenerateModelGetReferencePartialMethods<T extends Record<string, unknown>> = {
    [K in Extract<keyof T, string> as `get${Capitalize<K>}Reference`]: () => Partial<References<T>>;
};

export type GenerateModelMethods<
    T extends Record<string, unknown>
    > = GenerateModelAddMethods<T> & GenerateModelAddPartialMethods<T> & GenerateModelGetReferencePartialMethods<T>;

// stores.ts
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
    kvKey: string;
    pathPrefix: string;
    initialized: boolean;
    store: Record<string, unknown>;
} & BaseInstance;

export type DataStoreOptions = {
    name: string,
    key?: string,
    kvKey?: string,
    pathPrefix?: string,
}

// file-store.ts ------------------------------------------------------------
export type FileStoreInstance = {
    resource: Apify.KeyValueStore,
    initialized: boolean,
} & BaseInstance;

export type FileStoreOptions = {
    name: string,
    key?: string,
}

// trail-data.ts ------------------------------------------------------------
export type TrailDataInstance<ReferenceType = unknown> = {
    referenceKey: string;
    path: TrailDataPath;
    fragments: TrailModelPathsMethods<ReferenceType>;
    model: ModelInstance;
    store: DataStoreInstance;
} & BaseInstance;

export type TrailDataOptions = {
    path: TrailDataPath,
    model: ModelInstance,
    store: DataStoreInstance,
}

// trail.ts ------------------------------------------------------------
export type TrailInstance = {
    id: string;
    store: DataStoreInstance;
    models: ModelsInstance;
};

export type TrailOptions = {
    id?: string;
    store?: DataStoreInstance,
    models?: ModelsInstance,
}

export type TrailInOutMethodsOptions<ModelDefinitions> = {
    name: string;
    path: TrailDataPath;
    store: DataStore;
    methods: GenerateObject<keyof ModelDefinitions, TrailInOutMethods>,
    model: Model,
}

export type TrailDataPath = 'digested' | 'ingested';

export type TrailStateInOutItem = {
    reference: Partial<References<any>>,
    data: any,
    request: RequestSource,
}

export type TrailStateInOut = {
    [modelName: string]: {
        listingRequests: {
            [key: string]: RequestSource,
        },
        items: {
            [key: string]: TrailStateInOutItem,
        }
    },
}

export type TrailState = {
    id: string,
    query: any,
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
    status: 'SUCCESS' | 'FAILURE' | 'PENDING',
    ingested: TrailStateInOut,
    digested: TrailStateInOut,
}

export type TrailInOutMethods<ModelType = unknown> = {
    // paths
    getPath(ref?: References): string;
    getReferencePath(ref: References): string;
    getRequestPath(ref?: References): string;
    getListingRequestPath(ref: References): string;
    // items
    resolve(ref: References): ModelType;
    get(ref?: References): TrailStateInOutItem;
    getAsChildren(ref: References): TrailStateInOutItem[];
    getReference(ref: References): References;
    getItemsAsObject(): Record<string, TrailStateInOutItem>;
    getItems(): TrailStateInOutItem[];
    set(partialData: Partial<ModelType>, ref?: References): References;
    update(partialData: Partial<ModelType>, ref: References): References;
    // request
    getRequest(ref: References): References;
    setRequest(request: RequestSource, partialData: Partial<ModelType>, ref?: References): References;
    getRequestItemsAsObject(): Record<string, References>;
    getRequestItems(): References[];
    // listing requests
    setListingRequest(request: RequestSource, ref: References): References;
    getListingRequest(ref: References): RequestSource;
    getListingRequestItemsAsObject(ref: References): Record<string, RequestSource>;
    getListingRequestItems(ref: References): RequestSource[];
    // general
    count(ref: References): number;
    availableCount(ref: References): number;
    acceptsMore(keys?: string[], ref?: References): boolean;
    getNextKeys(keyedResults?: Record<string, unknown>, ref?: References): string[];
}

export type TrailModelPathsOptions = {
    name: string;
    path: TrailDataPath;
}

export type TrailModelPathsMethods<ReferenceType extends Record<string, unknown> = Record<string, unknown>> = {
    ITEMS: (reference: References<ReferenceType>) => string;
    ITEM_REQUEST: (reference: References<ReferenceType>) => string;
    ITEM_DATA: (reference: References<ReferenceType>) => string;
    ITEM_REFERENCE: (reference: References<ReferenceType>) => string;
    LISTING_REQUEST: (reference: References<ReferenceType>) => string;
}

// queue.ts ------------------------------------------------------------
export type QueueInstance = {
    resource: Apify.RequestQueue;
} & BaseInstance;

export type QueueOptions = {
    name?: string,
}

// queues.ts ------------------------------------------------------------
export type QueuesInstance<Names extends string[] = []> = GenerateObject<Names | DefaultQueueNames, StepInstance>;

export type DefaultQueueNames = ['default'];

export type QueuesOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

// dataset.ts ------------------------------------------------------------
export type DatasetOptions = {
    name: string,
}

export type DatasetInstance = {
    name: string;
    resource: Apify.Dataset;
} & BaseInstance;

// datasets.ts ------------------------------------------------------------
export type DatasetsInstance<Names extends string[] = []> = GenerateObject<Names | DefaultDatasetNames, DatasetInstance>;
export type DefaultDatasetNames = ['default'];
export type DatasetsOptions<Names extends string[] = []> = {
    names?: Names,
};

// actor.ts ------------------------------------------------------------
export type ActorOptions = {
    name?: string,
    steps?: Steps<any, any>;
    stepBaseApi?: StepBaseApi<any>;
    stepCustomApi?: StepCustomApi<any, any>;
    flows?: Flows<any>;
    models?: Models<any>;
    stores?: Stores<any>;
    queues?: Queues<any>;
    // datasets?: Datasets<any>;
    hooks?: Hooks<any>;
}

// router.ts ------------------------------------------------------------
export type RouterOptions = {
    key?: string,
}

// hooks.ts ------------------------------------------------------------HooksInstance
export type HooksInstance = {
    [K in DefaultHookNames[number]as `${SnakeToCamelCase<K>}`]: StepInstance;
};

export type DefaultHookNames = ['STEP_STARTED', 'STEP_ENDED', 'STEP_FAILED', 'STEP_REQUEST_FAILED',
    'ACTOR_STARTED', 'ACTOR_ENDED', 'QUEUE_STARTED', 'QUEUE_ENDED'];

export type GenerateHookFireMethods<T extends string[]> = {
    [K in T[number]as `fire${SnakeToPascalCase<K>}`]: (request: RequestSource) => void;
};

export type HookMethods = GenerateHookFireMethods<DefaultHookNames>;

// orchestrator.ts ------------------------------------------------------------
export type OrchestratorOptions = {
    name?: string,
}

// request-meta.ts ------------------------------------------------------------
export type RequestMetaInstance = {
    request: RequestSource,
    userData: Record<string, unknown>,
    data: RequestMetaData,
} & BaseInstance;

export type RequestMetaOptions = {
    nothing?: string,
}

export type RequestMetaData = {
    step?: string,
    trailId?: string,
    crawlerMode: 'ajax' | 'cheerio' | 'browser',
    references?: Partial<References<any>>,
}

// crawler.ts ------------------------------------------------------------
export type CrawlerOptions<CrawlerType extends Apify.BasicCrawler = DefaultCrawler> = {
    resource?: CrawlerType
}

export type CrawlerInstance<CrawlerType extends Apify.BasicCrawler = DefaultCrawler> = {
    resource: CrawlerType,
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
