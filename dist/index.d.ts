import Base from './base';
import Actor from './actor';
import Crawler from './crawler';
import Flows from './flows';
import Flow from './flow';
import Steps from './steps';
import Step from './step';
import StepApi from './step-api';
import StepApiFlow from './step-api-flow';
import StepApiMeta from './step-api-meta';
import StepApiModel from './step-api-model';
import StepApiUtils from './step-api-utils';
import Models from './models';
import Model from './model';
import Stores from './stores';
import DataStore from './data-store';
import FileStore from './file-store';
import Queues from './queues';
import Queue from './queue';
import Datasets from './datasets';
import Dataset from './dataset';
import Hooks from './hooks';
import Trail from './trail';
import TrailData from './trail-data';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';
import RequestMeta from './request-meta';
import Orchestrator from './orchestrator';
import Input from './input';
import Search from './search';
import Logger from './logger';
import RequestQueue from './sdk/request-queue';
import MultiCrawler from './sdk/multi-crawler';
export { Base, Actor, Crawler, Flows, Flow, Steps, Step, StepApi, StepApiFlow, StepApiMeta, StepApiModel, StepApiUtils, Models, Model, Stores, DataStore, FileStore, Queues, Queue, Datasets, Dataset, Hooks, Trail, TrailData, TrailDataModel, TrailDataRequests, RequestMeta, Orchestrator, Input, Search, Logger, RequestQueue, MultiCrawler, };
declare const _default: {
    Base: {
        create: (options: import("./types").BaseOptions) => import("./types").BaseInstance;
    };
    Actor: {
        create: (options?: import("./types").ActorOptions | undefined) => import("./types").ActorInstance;
        extend: (actor: import("./types").ActorInstance, options?: import("./types").ActorOptions) => import("./types").ActorInstance;
        run: (actor: import("./types").ActorInstance) => Promise<void>;
    };
    Crawler: {
        create: (options?: import("./types").CrawlerOptions | undefined) => import("./types").CrawlerInstance;
        run: (crawler: import("./types").CrawlerInstance, crawlerOptions?: import("./sdk/multi-crawler").MultiCrawlerOptions | undefined) => Promise<void>;
    };
    Flows: {
        create: <F extends Record<string, import("./types").FlowDefinition<string>>>({ FLOWS }: {
            FLOWS: F;
        }) => F;
        use: <S extends Record<string, Partial<Pick<import("./types").StepInstance<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
            type: "object";
        }>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>, M extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchema>>>(_: {
            STEPS: S;
            MODELS?: M | undefined;
        }) => {
            define: <T extends Record<string, import("./types").FlowDefinition<keyof S>>>(flows: T) => import("./types").FlowDefinitions<keyof S, T>;
        };
        names: <F_1 extends Record<string, import("./types").FlowDefinition<string>>>(FLOWS: F_1) => import("./types").FlowNamesObject<F_1>;
    };
    Flow: {
        create: <StepNames = string>(options: import("./types").FlowOptions<StepNames>) => import("./types").FlowInstance<StepNames>;
        has: <StepNames_1 = unknown>(flow: import("./types").FlowInstance<StepNames_1>, stepName: StepNames_1) => boolean;
    };
    Steps: {
        create: <M_1 extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchema>>, F_2 extends Record<string, import("./types").FlowDefinition<keyof StepDefinitions>>, StepDefinitions extends Record<string, Partial<Pick<import("./types").StepInstance<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
            type: "object";
        }>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>, I extends import("./types").InputDefinition<{
            type: "object";
        }>>({ STEPS }: {
            MODELS?: M_1 | undefined;
            FLOWS?: F_2 | undefined;
            STEPS: StepDefinitions;
            INPUT: I;
        }) => import("./types").StepsInstance<M_1, F_2, StepDefinitions, I>;
        define: <T_1 extends Record<string, Partial<Pick<import("./types").StepInstance<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
            type: "object";
        }>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>>(steps: T_1) => import("./types").StepDefinitions<T_1>;
    };
    Step: {
        create: <Methods = unknown>(options?: import("./types").StepOptions<Methods> | undefined) => import("./types").StepInstance<Methods>;
        on: (step: import("./types").StepInstance<unknown>, handler: () => void) => {
            handler: () => void;
            name: string;
            crawlerMode?: import("./types").RequestCrawlerMode | undefined;
            errorHandler?: import("./types").StepOptionsHandler<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            requestErrorHandler?: import("./types").StepOptionsHandler<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            uid?: string | undefined;
            key?: string | undefined;
            id: string;
        };
        extend: <Methods_1 = unknown>(step: import("./types").StepInstance<unknown>, options: import("./types").StepOptions<Methods_1>) => {
            crawlerMode?: import("./types").RequestCrawlerMode | undefined;
            handler?: import("./types").StepOptionsHandler<Methods_1 & import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            errorHandler?: import("./types").StepOptionsHandler<Methods_1 & import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            requestErrorHandler?: import("./types").StepOptionsHandler<Methods_1 & import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            name: string;
            uid?: string | undefined;
            key?: string | undefined;
            id: string;
        };
        run: (step: import("./types").StepInstance<unknown> | undefined, actor: import("./types").ActorInstance, context: import("./types").RequestContext | undefined) => Promise<void>;
    };
    StepApi: {
        create: <F_3 extends Record<string, import("./types").FlowDefinition<keyof S_1>>, S_1, M_2 extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchema>>, I_1 extends import("./types").InputDefinition<{
            type: "object";
        }>>(actor: import("./types").ActorInstance) => (context: import("./types").RequestContext) => import("./types").StepApiInstance<F_3, S_1, M_2, I_1>;
    };
    StepApiFlow: {
        create: <F_4 extends Record<string, import("./types").FlowDefinition<keyof S_2>>, S_2, M_3 extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchema>>>(actor: import("./types").ActorInstance) => import("./types").StepApiFlowsInstance<F_4, S_2, M_3>;
    };
    StepApiMeta: {
        create: (actor: import("./types").ActorInstance) => import("./types").StepApiMetaInstance;
    };
    StepApiModel: {
        create: <M_4 extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchema>>>(actor: import("./types").ActorInstance) => import("./types").StepApiModelInstance<M_4>;
    };
    StepApiUtils: {
        create: () => import("./types").StepApiUtilsInstance;
    };
    Models: {
        create: <M_5 extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchema>>>({ MODELS }: {
            MODELS: M_5;
        }) => M_5;
        define: <T_2 extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchemaWithMethods>>>(models: T_2) => T_2;
    };
    Model: {
        create: (options: import("./types").ModelOptions<import("./types").JSONSchema>) => import("./types").ModelInstance<import("./types").JSONSchema>;
        define: <T_3 extends import("./types").ModelDefinition<import("./types").JSONSchemaWithMethods>>(model: T_3) => T_3;
        dependencies: (model: import("./types").ModelInstance<import("./types").JSONSchema>) => import("./types").ModelInstance<import("./types").JSONSchema>[];
        referenceKeys: (model: import("./types").ModelInstance<import("./types").JSONSchema>) => string[];
        referenceFor: (model: import("./types").ModelInstance<import("./types").JSONSchema>, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>, withOwnReferenceKey?: boolean | undefined) => Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>;
        find: (model: import("./types").ModelInstance<import("./types").JSONSchema>, items: import("./types").TrailDataModelItem<any>[], newItem: import("./types").TrailDataModelItem<any>) => import("./types").TrailDataModelItem<any> | undefined;
        validate: <T_4 = unknown>(model: import("./types").ModelInstance<import("./types").JSONSchema>, data: T_4, options?: import("./types").ValidatorValidateOptions) => boolean;
        validateReference: <T_5 = unknown>(model: import("./types").ModelInstance<import("./types").JSONSchema>, ref: Partial<{ [K in Extract<keyof T_5, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>, options?: import("./types").ValidatorValidateOptions) => boolean;
        connect: ({ api }: {
            api: import("./types").GeneralStepApi<import("./types").InputDefinition<{
                type: "object";
            }>>;
        }) => {
            organizeList(model: import("./types").ModelInstance<import("./types").JSONSchema>, items: import("./types").TrailDataModelItem<unknown>[]): Promise<{
                valid: import("./types").TrailDataModelItem<unknown>[];
                invalid: import("./types").TrailDataModelItem<unknown>[];
            }>;
            isListComplete(model: import("./types").ModelInstance<import("./types").JSONSchema>, items: import("./types").TrailDataModelItem<unknown>[]): Promise<boolean>;
        };
        wrap: (model: import("./types").ModelInstance<import("./types").JSONSchema>) => import("./types").ModelInstance<import("./types").JSONSchema>;
        walk: (model: import("./types").ModelInstance<import("./types").JSONSchema>, walker: (key: string, value: any) => void) => void;
        flatten: (model: import("./types").ModelInstance<import("./types").JSONSchema>) => import("./types").ModelInstance<import("./types").JSONSchema>[];
    };
    Stores: {
        create: <DataStoreNames extends string[] = [], FileStoreNames extends string[] = []>(options?: import("./types").StoresOptions<DataStoreNames, FileStoreNames> | undefined) => import("./types").StoresInstance<DataStoreNames, FileStoreNames>;
        load: (stores: import("./types").StoresInstance<[], []>) => Promise<import("./types").StoresInstance<[], []>>;
        persist: (stores: import("./types").StoresInstance<[], []>) => Promise<void>;
        listen: (stores: import("./types").StoresInstance<[], []>) => void;
        DefaultDataStores: import("./types").GenerateObject<import("./types").DefaultDataStoreNames, import("./types").DataStoreInstance>;
        DefautFileStores: import("./types").GenerateObject<import("./types").DefaultFileStoreNames, import("./types").FileStoreInstance>;
    };
    DataStore: {
        create: (options: import("./types").DataStoreOptions) => import("./types").DataStoreInstance;
        get: <T_6 = any>(dataStore: import("./types").DataStoreInstance, path?: string | undefined) => T_6;
        set: <T_7 = any>(dataStore: import("./types").DataStoreInstance, path: string, data: T_7) => void;
        remove: (dataStore: import("./types").DataStoreInstance, path: string) => void;
        has: (dataStore: import("./types").DataStoreInstance, path: string) => boolean;
        entries: <T_8 = any>(dataStore: import("./types").DataStoreInstance, path?: string | undefined) => [string, T_8][];
        values: <T_9 = any>(dataStore: import("./types").DataStoreInstance, path?: string | undefined) => T_9[];
        keys: <T_10 = any>(dataStore: import("./types").DataStoreInstance, path?: string | undefined) => string[];
        increment: (dataStore: import("./types").DataStoreInstance, path: string, stepNumber?: number) => number;
        decrement: (dataStore: import("./types").DataStoreInstance, path: string, stepNumber?: number) => number;
        pop: <T_11 = any>(dataStore: import("./types").DataStoreInstance, path: string) => T_11;
        shift: <T_12 = any>(dataStore: import("./types").DataStoreInstance, path: string) => T_12;
        push: <T_13 = any>(dataStore: import("./types").DataStoreInstance, path: string, ...data: T_13[]) => void;
        setAndGetKey: <T_14 = any>(dataStore: import("./types").DataStoreInstance, data: T_14) => string;
        update: <T_15 = any>(dataStore: import("./types").DataStoreInstance, path: string, data: T_15) => void;
        load: (dataStore: import("./types").DataStoreInstance) => Promise<import("./types").DataStoreInstance>;
        persist: (dataStore: import("./types").DataStoreInstance) => Promise<void>;
        listen: (dataStore: import("./types").DataStoreInstance) => void;
    };
    FileStore: {
        create: (options: import("./types").FileStoreOptions) => import("./types").FileStoreInstance;
        load: (fileStore: import("./types").FileStoreInstance) => Promise<import("./types").FileStoreInstance>;
        get: (fileStore: import("./types").FileStoreInstance, key: string) => Promise<import("apify").KeyValueStoreValueTypes | undefined>;
        set: <TValue extends object = any>(fileStore: import("./types").FileStoreInstance, key: string, value: TValue, options?: {
            contentType?: string | undefined;
        } | undefined) => Promise<void | undefined>;
    };
    Queues: {
        create: <Names extends string[] = []>(options?: import("./types").QueuesOptions<Names> | undefined) => import("./types").QueuesInstance<Names>;
        DefaultQueues: {
            default: import("./types").QueueInstance;
        };
    };
    Queue: {
        create: (options?: import("./types").QueueOptions | undefined) => import("./types").QueueInstance;
        load: (queue: import("./types").QueueInstance, options?: {
            forceCloud?: boolean | undefined;
        } | undefined) => Promise<import("./types").QueueInstance>;
        add: (queue: import("./types").QueueInstance, request: import("./types").RequestSource, options?: import("./types").RequestOptionalOptions) => Promise<import("apify").QueueOperationInfo>;
    };
    Datasets: {
        create: <Names_1 extends string[] = []>(options?: import("./types").DatasetsOptions<Names_1> | undefined) => import("./types").DatasetsInstance<Names_1>;
    };
    Dataset: {
        create: (options: import("./types").DatasetOptions) => import("./types").DatasetInstance;
        load: (dataset: import("./types").DatasetInstance) => Promise<import("./types").DatasetInstance>;
        push: (dataset: import("./types").DatasetInstance, data: any) => Promise<void | undefined>;
    };
    Hooks: {
        create: <M_6 extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchema>>, F_5 extends Record<string, import("./types").FlowDefinition<keyof S_3>>, S_3, I_2 extends import("./types").InputDefinition<{
            type: "object";
        }>>(_: {
            MODELS?: M_6 | undefined;
            FLOWS?: F_5 | undefined;
            STEPS: S_3;
            INPUT: I_2;
        }) => import("./types").HooksInstance<M_6, F_5, S_3, I_2>;
    };
    Trail: {
        create: (options: import("./types").TrailOptions) => import("./types").TrailInstance;
        createFrom: (request: import("./types").RequestSource, options: import("./types").TrailOptions) => import("./types").TrailInstance;
        load: (trail: import("./types").TrailInstance) => Promise<import("./types").TrailInstance>;
        get: (trail: import("./types").TrailInstance) => import("./types").TrailState;
        setRequest: (trail: import("./types").TrailInstance, request: any) => void;
        setFlow: (trail: import("./types").TrailInstance, flowState: import("./types").TrailFlowState) => string;
        getFlow: (trail: import("./types").TrailInstance, flowKey: string | undefined) => import("./types").TrailFlowState | undefined;
        ingested: (trail: import("./types").TrailInstance) => import("./types").TrailDataStage;
        digested: (trail: import("./types").TrailInstance) => import("./types").TrailDataStage;
        promote: (trail: import("./types").TrailInstance, item: import("./types").TrailDataModelItem<unknown> | import("./types").TrailDataRequestItem) => void;
    };
    TrailData: {
        getPath: <T_16 = unknown>(trailData: import("./types").TrailDataInstance, ref: Partial<{ [K_1 in Extract<keyof T_16, string> as `${import("./types").SnakeToCamelCase<K_1>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>, ...segments: string[]) => string;
        defaultUpdateMerger: (existingValue: any, newValue: any) => any;
    };
    TrailDataModel: {
        create: (options: import("./types").TrailDataModelOptions) => import("./types").TrailDataModelInstance;
        get: <T_17 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, ref: Partial<{ [K_2 in Extract<keyof T_17, string> as `${import("./types").SnakeToCamelCase<K_2>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => import("./types").TrailDataModelItem<T_17>;
        getItems: <T_18 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, ref?: Partial<{ [K_3 in Extract<keyof T_18, string> as `${import("./types").SnakeToCamelCase<K_3>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined) => Record<string, import("./types").TrailDataModelItem<unknown>>;
        getItemsList: <T_19 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, ref?: Partial<{ [K_4 in Extract<keyof T_19, string> as `${import("./types").SnakeToCamelCase<K_4>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined) => import("./types").TrailDataModelItem<unknown>[];
        getItemsListByStatus: (trailDataModel: import("./types").TrailDataModelInstance, status: import("./types").TrailDataModelItemStatus | import("./types").TrailDataModelItemStatus[], ref?: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined) => import("./types").TrailDataModelItem<unknown>[];
        getChildrenItemsList: <T_20 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, parentRef: Partial<{ [K_5 in Extract<keyof T_20, string> as `${import("./types").SnakeToCamelCase<K_5>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => import("./types").TrailDataModelItem<unknown>[];
        update: <T_21 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: Partial<T_21>, ref: Partial<{ [K_6 in Extract<keyof T_21, string> as `${import("./types").SnakeToCamelCase<K_6>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => Partial<{ [K_6 in Extract<keyof T_21, string> as `${import("./types").SnakeToCamelCase<K_6>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>;
        updatePartial: <T_22 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: Partial<T_22>, ref: Partial<{ [K_7 in Extract<keyof T_22, string> as `${import("./types").SnakeToCamelCase<K_7>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => Partial<{ [K_7 in Extract<keyof T_22, string> as `${import("./types").SnakeToCamelCase<K_7>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>;
        set: <T_23 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: T_23, ref?: Partial<{ [K_8 in Extract<keyof T_23, string> as `${import("./types").SnakeToCamelCase<K_8>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined) => Partial<{ [K_8 in Extract<keyof T_23, string> as `${import("./types").SnakeToCamelCase<K_8>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>;
        setStatus: (trailDataModel: import("./types").TrailDataModelInstance, status: import("./types").TrailDataModelItemStatus, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => void;
        count: <T_24>(trailDataModel: import("./types").TrailDataModelInstance, ref: Partial<{ [K_9 in Extract<keyof T_24, string> as `${import("./types").SnakeToCamelCase<K_9>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => number;
        setPartial: <T_25 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: Partial<T_25>, ref: Partial<{ [K_10 in Extract<keyof T_25, string> as `${import("./types").SnakeToCamelCase<K_10>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => Partial<{ [K_10 in Extract<keyof T_25, string> as `${import("./types").SnakeToCamelCase<K_10>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>;
        boostrapItem: <T_26 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: T_26, ref?: Partial<{ [K_11 in Extract<keyof T_26, string> as `${import("./types").SnakeToCamelCase<K_11>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined) => Partial<import("./types").TrailDataModelItem<T_26>>;
        filterByStatus: (...statuses: import("./types").TrailDataModelItemStatus[]) => (value: any) => boolean;
        filterByPartial: (partial?: boolean | undefined) => (value: any) => boolean;
        groupByParentHash: (trailDataModel: import("./types").TrailDataModelInstance, items: import("./types").TrailDataModelItem<unknown>[]) => Map<string, import("./types").TrailDataModelItem<unknown>[]>;
        getExistingReference: <T_27 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: T_27) => Partial<{ [K_12 in Extract<keyof T_27, string> as `${import("./types").SnakeToCamelCase<K_12>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined;
    };
    TrailDataRequests: {
        create: (options: import("./types").TrailDataRequestsOptions) => import("./types").TrailDataRequestsInstance;
        count: (trailDataRequests: import("./types").TrailDataRequestsInstance, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => number;
        get: (trailDataRequests: import("./types").TrailDataRequestsInstance, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => import("./types").TrailDataRequestItem;
        getItems: (trailDataRequests: import("./types").TrailDataRequestsInstance) => Record<string, import("./types").TrailDataRequestItem>;
        getItemsList: (trailDataRequests: import("./types").TrailDataRequestsInstance, ref?: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined) => import("./types").TrailDataRequestItem[];
        getReference: (trailDataRequests: import("./types").TrailDataRequestsInstance, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>;
        set: (trailDataRequests: import("./types").TrailDataRequestsInstance, request: import("./types").RequestSource, ref?: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined) => Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>;
        setStatus: (trailDataRequests: import("./types").TrailDataRequestsInstance, status: import("./types").TrailDataRequestItemStatus, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }>) => void;
        getItemsListByStatus: (trailDataRequests: import("./types").TrailDataRequestsInstance, status: import("./types").TrailDataRequestItemStatus | import("./types").TrailDataRequestItemStatus[], ref?: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
        }> | undefined) => import("./types").TrailDataRequestItem[];
    };
    RequestMeta: {
        create: (requestOrRequestContext?: import("./types").RequestSource | import("./types").RequestContext | undefined) => import("./types").RequestMetaInstance;
        extend: (requestMeta: import("./types").RequestMetaInstance, ...metadata: Partial<import("./types").RequestMetaData>[]) => import("./types").RequestMetaInstance;
        contextDefaulted: (context?: import("./types").RequestContext | undefined) => import("./types").RequestContext;
    };
    Orchestrator: {
        create: (actor: import("./types").ActorInstance) => import("./types").OrchestratorInstance;
        run: (orchestrator: import("./types").OrchestratorInstance, context: import("./types").RequestContext, api: import("./types").StepApiInstance<any, any, any, any>) => Promise<void>;
    };
    Input: {
        create: <I_3 extends import("./types").InputDefinition<{
            type: "object";
        }>>({ INPUT }: {
            INPUT: I_3;
        }) => import("./types").InputInstance<I_3["schema"]>;
        define: <I_4 extends import("./types").InputDefinition<{
            type: "object";
        }>>(input: I_4) => I_4;
    };
    Search: {
        create: (options: import("./types").SearchOptions) => {
            indexOptions: import("flexsearch").IndexOptions<string, false> | undefined;
            documentOptions: import("flexsearch").IndexOptionsForDocumentSearch<unknown, false> | undefined;
            uid?: string | undefined;
            key?: string | undefined;
            name: string;
            id: string;
        };
        withinObjects: <T_28 extends Record<string, any>>(search: import("./types").SearchInstance, path: string, items: T_28[], query: string) => T_28[];
        withinTexts: (search: import("./types").SearchInstance, items: string[], query: string) => string[];
        withinTextsAsIndexes: (search: import("./types").SearchInstance, items: string[], query: string) => (string | number)[];
    };
    Logger: {
        create: (element: {
            id: string;
        }, options?: import("./types").LoggerOptions | undefined) => import("./types").LoggerInstance;
        setDebug: () => void;
        setInfo: () => void;
        debug: (logger: import("./types").LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
        start: (logger: import("./types").LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
        end: (logger: import("./types").LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
        info: (logger: import("./types").LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
        error: (logger: import("./types").LoggerInstance, messages?: string | string[] | undefined, data?: Record<string, any> | undefined) => void;
    };
    RequestQueue: typeof RequestQueue;
    MultiCrawler: typeof MultiCrawler;
};
export default _default;
//# sourceMappingURL=index.d.ts.map