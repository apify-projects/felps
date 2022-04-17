/* eslint-disable @typescript-eslint/no-explicit-any */
import type Apify from 'apify';
import { CrawlingContext } from 'apify';
import { LogLevel } from 'apify/build/utils_log';
import type { JSONSchema7 } from 'json-schema';

export type UniqueyKey = string;

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
// export type GenerateMethods<
//     Prefix extends string,
//     T extends string[],
//     Signature = () => void,
//     Suffix extends string = '',
//     > = { [K in T[number]as `${Prefix}${Capitalize<K>}${Suffix}`]: Signature };

// apify --------------------------------------------------
export type RequestSource = import('apify').Request | import('apify').RequestOptions
export type RequestOptionalOptions = { forefront?: boolean | undefined } | undefined
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
export type FlowsInstance<Names extends string[] = []> = GenerateObject<Names, FlowInstance>;

export type FlowsOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

// export type GenerateFlowSetMethods<FlowNames> = {
//     [K in Extract<FlowNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<FlowOptions>) => void;
// };

// flow.ts ------------------------------------------------------------
export type FlowInstance = {
    steps: StepInstance[],
    output: JSONSchema7,
} & BaseInstance;

export type FlowOptions = {
    name: string,
    steps?: StepInstance[],
    output?: JSONSchema7,
}

// steps.ts ------------------------------------------------------------
export type StepsInstance<Names extends string[] = []> = GenerateObject<Names, StepInstance>;

export type StepsOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

// export type StepOnMethods<StepType extends string, MethodsByStep extends Record<string, unknown>> = MethodsByStep[StepType];

// export type GenerateStepOnMethods<StepNames, Methods, MethodsByStep extends Record<string, unknown>> = {
//     [K in Extract<StepNames, string> as `${SnakeToCamelCase<K>}`]: (handler: StepOptionsHandler<StepOnMethods<K, MethodsByStep> & Methods>) => void;
// };

// export type GenerateStepSetMethods<StepNames, InitialMethods, MethodsByStep extends Record<string, unknown>> = {
//     [K in Extract<StepNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<StepOptions<InitialMethods, StepOnMethods<K, MethodsByStep>>>) => void;
// };

// step.ts ------------------------------------------------------------
export type StepInstance<Methods = unknown> = {
    name: string,
    handler?: StepOptionsHandler<Methods>,
    // controlHandler?: StepOptionsHandler<Methods>,
    errorHandler?: StepOptionsHandler<Methods>,
    requestErrorHandler?: StepOptionsHandler<Methods>,
} & BaseInstance;

export type StepOptions<InitialMethods = unknown, Methods = unknown> = {
    name: string,
    handler?: StepOptionsHandler<InitialMethods & Methods>,
    // controlHandler?: StepOptionsHandler<InitialMethods & Methods>,
    errorHandler?: StepOptionsHandler<InitialMethods & Methods>,
    requestErrorHandler?: StepOptionsHandler<InitialMethods & Methods>,
    // extendStepApi?: StepCustomApiExtend<InitialMethods, Methods>,
    // stepApi?: StepCustomApi<InitialMethods, Methods>,
}

export type StepOptionsHandler<Methods = unknown> = (context: RequestContext, api: Methods) => Promise<void>

// export type GenerateStepGoMethods<T, ModelDefinitions extends Record<string, unknown> = Record<string, unknown>> = {
//     [K in Extract<T, string> as `go${SnakeToPascalCase<K>}`]: (request: RequestSource, references: ModelReference<ModelDefinitions>) => void;
// };

// export type GenerateStepMethods<T, ModelDefinitions extends Record<string, unknown> = Record<string, unknown>> = GenerateStepGoMethods<T, ModelDefinitions>;

// step-api-meta.ts ------------------------------------------------------------
export type StepApiMetaInstance = {
    handler: (context: CrawlingContext) => {
        getUserData: () => Record<string, unknown>,
        getMetaData: () => RequestMetaData,
        getModelReference: () => RequestMetaData['reference'],
    },
};

// step-api-utils.ts ------------------------------------------------------------
export type StepApiUtilsInstance = {
    handler: (context: CrawlingContext) => {
        absoluteUrl: (url: string) => string | void,
    },
};

// step-api.ts ------------------------------------------------------------
// export type StepBaseApiInstance<ModelDefinitions = unknown, Context extends MakeStepBaseApiContext = MakeStepBaseApiContext> = {
//     handler: (context: CrawlingContext) => StepBaseApiMethodsDefinition<ModelDefinitions, Context>
// } & BaseInstance;

// export type StepBaseApiOptions = {
//     input: any,
//     step: StepInstance,
//     stores: StoresInstance,
//     datasets: DatasetsInstance,
//     queues: QueuesInstance,
// }

// export type StepBaseApiMethods<
//     ModelDefinitions = unknown,
//     Context extends MakeStepBaseApiContext = MakeStepBaseApiContext
//     > = StepBaseApiMethodsDefinition<ModelDefinitions, Context> & HookMethods;

// export type StepBaseApiMethodsDefinition<ModelDefinitions = unknown, Context extends MakeStepBaseApiContext = MakeStepBaseApiContext> = {
//     // main api
//     step: Context['step'],
//     stores: Context['stores'],
//     datasets: Context['datasets'],
//     queues: Context['queues'],
//     // accessors
//     getInput: () => Context['input'],
//     getStep: () => string,
//     getUserData: () => any,
//     getModelReference: () => Partial<ModelReference<any>>,
//     // trail
//     trail: Trail<ModelDefinitions>,
//     // common
//     log: Logger,
//     // utils
//     absoluteUrl(path: string): string | void,
// }

// export type MakeStepBaseApiContext<
//     Input = unknown,
//     StepType = StepInstance,
//     StoreNames extends string[] = [],
//     DatasetNames extends string[] = [],
//     QueueNames extends string[] = [],
//     ModelDefinitions extends Record<string, unknown> = Record<string, unknown>,
//     > = {
//         input: Input,
//         step: StepType,
//         queues: GenerateObject<QueueNames & DefaultQueueNames, Queue>,
//         stores: GenerateObject<StoreNames & DefaultStoreNames, AnyStore>;
//         datasets: GenerateObject<DatasetNames & DefaultDatasetNames, Dataset>,
//         models: Models<ModelDefinitions>,
//     };

// step-custom-api.ts ------------------------------------------------------------
// export type StepCustomApiOptions<InitialMethods = unknown, Methods = unknown> = {
//     extend: StepCustomApiExtend<InitialMethods, Methods>,
// }

// export type StepCustomApiExtend<
//     InitialMethods = unknown,
//     Methods = unknown
//     > = (crawlingContext: RequestContext, api: Without<InitialMethods, Methods>) => Methods

// models.ts ------------------------------------------------------------
export type ModelsInstance<ModelDefinitions = Record<string, never>> = GenerateObject<Extract<keyof ModelDefinitions, string>[], ModelInstance>

export type ModelsOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

// export type GenerateModelSetMethods<ModelNames> = {
//     [K in Extract<ModelNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<ModelOptions>) => void;
// };

// model.ts ------------------------------------------------------------
export type ModelInstance = {
    schema: JSONSchema7,
} & BaseInstance;

export type ModelOptions = {
    name: string,
    schema?: JSONSchema7,
}

export type ModelReference<T = unknown> = {
    [K in Extract<keyof T, string> as `${K}Key`]: UniqueyKey;
} & { requestKey: UniqueyKey };

// export type GenerateModelAddMethods<T extends Record<string, unknown>> = {
//     [K in Extract<keyof T, string> as `add${Capitalize<K>}`]: (value: T[K], ref?: Partial<ModelReference<T>>) => Partial<ModelReference<T>>;
// };

// export type GenerateModelAddPartialMethods<T extends Record<string, unknown>> = {
//     [K in Extract<keyof T, string> as `add${Capitalize<K>}Partial`]: (value: Partial<T[K]>, ref?: Partial<ModelReference<T>>) => Partial<ModelReference<T>>;
// };

// export type GenerateModelGetReferencePartialMethods<T extends Record<string, unknown>> = {
//     [K in Extract<keyof T, string> as `get${Capitalize<K>}Reference`]: () => Partial<ModelReference<T>>;
// };

// export type GenerateModelMethods<
//     T extends Record<string, unknown>
//     > = GenerateModelAddMethods<T> & GenerateModelAddPartialMethods<T> & GenerateModelGetReferencePartialMethods<T>;

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
    ingested: TrailDataFunnel,
    digested: TrailDataFunnel,
}

// export type TrailInOutMethodsOptions<ModelDefinitions> = {
//     name: string;
//     path: TrailDataPath;
//     store: DataStore;
//     methods: GenerateObject<keyof ModelDefinitions, TrailInOutMethods>,
//     model: Model,
// }

// trail-data.ts ------------------------------------------------------------
export type TrailDataInstance<ReferenceType = unknown> = {
    referenceKey: string;
    path: TrailDataPath;
    fragments: TrailDataModelPathsMethods<ReferenceType>;
    model: ModelInstance;
    store: DataStoreInstance;
} & BaseInstance;

export type TrailDataOptions = {
    path: TrailDataPath,
    model: ModelInstance,
    store: DataStoreInstance,
}

export type TrailDataPath = 'digested' | 'ingested';

export type TrailDataModelItem<T = unknown> = {
    reference: Partial<ModelReference<T>>,
    data: Partial<T>,
}

export type TrailDataModels = {
    [modelName: string]: {
        [key: string]: TrailDataModelItem,
    },
}

export type TrailDataFunnel = {
    items: TrailDataModels,
    requests: Record<string, RequestSource>,
}

export type TrailDataModelPathsMethods<T> = {
    ITEMS: (reference: ModelReference<T>) => string;
    REQUESTS: (reference: ModelReference<T>) => string;
}

export type TrailModelPathsOptions = {
    name: string;
    path: TrailDataPath;
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
    crawler?: CrawlerInstance,
    steps?: StepsInstance;
    flows?: FlowsInstance;
    models?: ModelsInstance;
    stores?: StoresInstance;
    queues?: QueuesInstance;
    datasets?: DatasetsInstance;
    hooks?: HooksInstance;
} & BaseInstance;

export type ActorOptions = {
    name?: string,
    crawler?: CrawlerInstance,
    steps?: StepsInstance;
    flows?: FlowsInstance;
    models?: ModelsInstance;
    stores?: StoresInstance;
    queues?: QueuesInstance;
    datasets?: DatasetsInstance;
    hooks?: HooksInstance;
}

// hooks.ts ------------------------------------------------------------
export type HooksInstance = {
    [K in DefaultHookNames[number]as `${SnakeToCamelCase<K>}`]: StepInstance;
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

export type RequestMetaData = {
    step?: string,
    trailId?: string,
    crawlerMode: 'ajax' | 'cheerio' | 'browser',
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
