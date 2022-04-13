/* eslint-disable @typescript-eslint/no-explicit-any */
import type Apify from 'apify';
import { Dataset } from 'apify';
import type Actor from '../actor';
import type DataStore from '../data-store';
import type Datasets from '../datasets';
import type FileStore from '../file-store';
import type Flows from '../flows';
import type Hooks from '../hooks';
import type Logger from '../logger';
import Model from '../model';
import type Models from '../models';
import type Queue from '../queue';
import type Queues from '../queues';
import Step from '../step';
import type StepBaseApi from '../step-base-api';
import type StepCustomApi from '../step-custom-api';
import type Steps from '../steps';
import type Stores from '../stores';
import type Trail from '../trail';

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
export type GenerateObject<N, T> = { [K in Extract<N, string>]: T };
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
    key?: string,
    name: string,
}

// flows.ts ------------------------------------------------------------
export type FlowsOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

export type GenerateFlowSetMethods<FlowNames> = {
    [K in Extract<FlowNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<FlowOptions>) => void;
};
// flow.ts ------------------------------------------------------------
export type FlowOptions = {
    name: string,
    steps?: Step[],
}

// steps.ts
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
    controlHandler?: StepOptionsHandler<InitialMethods & Methods>,
    failHandler?: StepOptionsHandler<InitialMethods & Methods>,
    requestErrorHandler?: StepOptionsHandler<InitialMethods & Methods>,
    extendStepApi?: StepCustomApiExtend<InitialMethods, Methods>,
    stepApi?: StepCustomApi<InitialMethods, Methods>,
}

export type StepOptionsHandler<Methods = unknown> = (context: RequestContext, api: Methods) => Promise<void>

export type GenerateStepGotoMethods<T, ModelDefinitions extends Record<string, unknown> = Record<string, never>> = {
    [K in Extract<T, string> as `goto${SnakeToPascalCase<K>}`]: (request: RequestSource, references: References<ModelDefinitions>) => void;
};

export type GenerateStepMethods<T, ModelDefinitions extends Record<string, unknown> = Record<string, never>> = GenerateStepGotoMethods<T, ModelDefinitions>;

// step-base-api.ts ------------------------------------------------------------
// export type StepBaseApiOptions = {
// }

export type StepBaseApiMethods<
    ModelDefinitions = unknown,
    Context extends MakeStepBaseApiContext = MakeStepBaseApiContext
    > = StepBaseRootMethods<ModelDefinitions, Context> & HookMethods;

export type StepBaseRootMethods<ModelDefinitions = unknown, Context extends MakeStepBaseApiContext = MakeStepBaseApiContext> = {
    // step
    uid: string,
    name: string,
    id: string
    // main api
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
    StoreNames extends string[] = [],
    DatasetNames extends string[] = [],
    QueueNames extends string[] = [],
    ModelDefinitions extends Record<string, unknown> = Record<string, unknown>,
    > = {
        input: Input,
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

export type References<T extends Record<string, string> = Record<string, string>> = {
    [K in Extract<keyof T, string> as `${K}Key`]: string;
} & { requestKey: string };

// models.ts ------------------------------------------------------------
export type ModelsOptions<Names> = {
    names?: Extract<ValueOf<Names>, string>[],
}

export type GenerateModelSetMethods<ModelNames> = {
    [K in Extract<ModelNames, string> as `${SnakeToCamelCase<K>}`]: (options: Partial<ModelOptions>) => void;
};

// model.ts ------------------------------------------------------------
export type ModelOptions = {
    name: string,
    schema?: any,
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
export type AnyStore = DataStore | FileStore;
export type DefaultStoreNames = 'default' | 'trails' | 'incorrectDataset' | 'files' | 'responseBodies' | 'browserTraces'
export type AnyStoreOptions = { type?: 'data' | 'file' } & (DataStoreOptions | FileStoreOptions);

// data-store.ts ------------------------------------------------------------
export type DataStoreOptions = {
    name: string,
    key?: string,
    kvKey?: string,
    pathPrefix?: string,
}

// file-store.ts ------------------------------------------------------------
export type FileStoreOptions = {
    name: string,
    key?: string,
}

// trail.ts ------------------------------------------------------------
export type TrailOptions = {
    id?: string;
    store?: DataStore,
    models?: Models,
}

export type TrailInOutMethodsOptions<ModelDefinitions> = {
    name: string;
    path: TrailStateInOutNames;
    store: DataStore;
    methods: GenerateObject<keyof ModelDefinitions, TrailInOutMethods>,
    model: Model,
}

export type TrailStateInOutNames = 'digested' | 'ingested';

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
    get(ref?: References): ModelType;
    getAsChildren(ref: References): ModelType[];
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
    path: TrailStateInOutNames;
}

export type TrailModelPathsMethods<ReferenceType> = {
    ITEMS: (reference: Partial<ReferenceType>) => string;
    ITEM_REQUEST: (reference: Partial<ReferenceType>) => string;
    ITEM_DATA: (reference: Partial<ReferenceType>) => string;
    ITEM_REFERENCE: (reference: Partial<ReferenceType>) => string;
    LISTING_REQUEST: (reference: Partial<ReferenceType>) => string;
}


// queue.ts ------------------------------------------------------------
export type QueueOptions = {
    name?: string,
}

// queues.ts ------------------------------------------------------------
export type DefaultQueueNames = 'default';

// dataset.ts ------------------------------------------------------------
export type DatasetOptions = {
    name: string,
}

// datasets.ts ------------------------------------------------------------
export type DefaultDatasetNames = 'default';

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
    datasets?: Datasets<any>;
    hooks?: Hooks<any>;
}

// router.ts ------------------------------------------------------------
export type RouterOptions = {
    key?: string,
}

// hooks.ts ------------------------------------------------------------
export type DefaultHookNames = 'STEP_STARTED' | 'STEP_ENDED' | 'STEP_FAILED'
    | 'STEP_REQUEST_FAILED' | 'ACTOR_STARTED' | 'ACTOR_ENDED'
    | 'QUEUE_STARTED' | 'QUEUE_ENDED';

export type GenerateHookFireMethods<T extends string[]> = {
    [K in T[number]as `fire${SnakeToPascalCase<K>}`]: (request: RequestSource) => void;
};

export type HookMethods = GenerateHookFireMethods<DefaultHookNames[]>;

// orchestrator.ts ------------------------------------------------------------
export type OrchestratorOptions = {
    name?: string,
}

// request-meta.ts ------------------------------------------------------------
export type RequestMetaOptions = {
    nothing?: string,
}

export type RequestMetaData = {
    step?: string,
    trailId?: string,
    crawlerMode: 'ajax' | 'cheerio' | 'browser',
    references?: Partial<References<any>>,
}
