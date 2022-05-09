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
import Trails from './trails';
import TrailData from './trail-data';
import TrailDataModel from './trail-data-model';
import TrailDataRequests from './trail-data-requests';
import RequestMeta from './request-meta';
import Orchestrator from './orchestrator';
import Input from './input';
import Search from './search';
import UrlPattern from './url-pattern';
import Logger from './logger';
import RequestQueue from './sdk/request-queue';
import MultiCrawler from './sdk/multi-crawler';
export { Base, Actor, Crawler, Flows, Flow, Steps, Step, StepApi, StepApiFlow, StepApiMeta, StepApiModel, StepApiUtils, Models, Model, Stores, DataStore, FileStore, Queues, Queue, Datasets, Dataset, Hooks, Trail, Trails, TrailData, TrailDataModel, TrailDataRequests, RequestMeta, Orchestrator, Input, Search, UrlPattern, Logger, RequestQueue, MultiCrawler, };
declare const _default: {
    Base: {
        create: (options: import("./types").BaseOptions) => import("./types").BaseInstance;
    };
    Actor: {
        create: (options: import("./types").ActorOptions) => import("./types").ActorInstance;
        extend: (actor: import("./types").ActorInstance, options?: Partial<import("./types").ActorOptions>) => import("./types").ActorInstance;
        run: (actor: import("./types").ActorInstance, input: import("./types").ActorInput, crawlerOptions?: import("apify").PlaywrightCrawlerOptions | undefined) => Promise<void>;
        prefix: (actor: import("./types").ActorInstance, text: string) => string;
        combine: (actor: import("./types").ActorInstance, ...actors: import("./types").ActorInstance[]) => import("./types").ActorInstance;
    };
    Crawler: {
        create: (options?: import("./types").CrawlerOptions | undefined) => import("./types").CrawlerInstance;
        run: (crawler: import("./types").CrawlerInstance, crawlerOptions?: import("apify").PlaywrightCrawlerOptions | undefined) => Promise<void>;
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
            define: <T extends Record<string, import("./types").FlowDefinition<keyof S>>>(flows: T) => T;
        };
        names: <F_1 extends Record<string, import("./types").FlowDefinition<string>>>(FLOWS: F_1) => import("./types").FlowNamesObject<F_1>;
        clone: <T_1>(flows: T_1) => T_1;
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
        define: <T_2 extends Record<string, Partial<Pick<import("./types").StepInstance<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
            type: "object";
        }>> & import("./types").StepApiUtilsAPI>, "crawlerMode">>>>(steps: T_2) => import("./types").StepDefinitions<T_2>;
        clone: <T_3>(hooks: T_3) => T_3;
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
            afterHandler?: import("./types").StepOptionsHandler<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            beforeHandler?: import("./types").StepOptionsHandler<import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            actorKey?: string | undefined;
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
            afterHandler?: import("./types").StepOptionsHandler<Methods_1 & import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            beforeHandler?: import("./types").StepOptionsHandler<Methods_1 & import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
                type: "object";
            }>> & import("./types").StepApiUtilsAPI> | undefined;
            actorKey?: string | undefined;
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
        }>>(actor: import("./types").ActorInstance) => (context: import("./types").RequestContext) => import("./types").StepApiInstance<F_3, S_1, M_2, I_1, "nope">;
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
        define: <T_4 extends Record<string, import("./types").ModelDefinition<import("./types").JSONSchemaWithMethods>>>(models: T_4) => T_4;
        clone: <T_5>(models: T_5) => T_5;
    };
    Model: {
        create: (options: import("./types").ModelOptions<import("./types").JSONSchema>) => import("./types").ModelInstance<import("./types").JSONSchema>;
        define: <T_6 extends import("./types").ModelDefinition<import("./types").JSONSchemaWithMethods>>(model: T_6) => T_6;
        dependencies: (model: import("./types").ModelInstance<import("./types").JSONSchema>) => import("./types").ModelInstance<import("./types").JSONSchema>[];
        referenceKeys: (model: import("./types").ModelInstance<import("./types").JSONSchema>) => string[];
        referenceFor: (model: import("./types").ModelInstance<import("./types").JSONSchema>, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>, withOwnReferenceKey?: boolean | undefined) => Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        find: (model: import("./types").ModelInstance<import("./types").JSONSchema>, items: import("./types").TrailDataModelItem<any>[], newItem: import("./types").TrailDataModelItem<any>) => import("./types").TrailDataModelItem<any> | undefined;
        validate: <T_7 = unknown>(model: import("./types").ModelInstance<import("./types").JSONSchema>, data: T_7, options?: import("./types").ValidatorValidateOptions) => {
            valid: boolean;
            errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
        };
        validateReference: <T_8 = unknown>(model: import("./types").ModelInstance<import("./types").JSONSchema>, ref: Partial<{ [K in Extract<keyof T_8, string> as `${import("./types").SnakeToCamelCase<K>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>, options?: import("./types").ValidatorValidateOptions) => {
            valid: boolean;
            errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
        };
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
        load: (stores: import("./types").StoresInstance<import("./types").DefaultDataStoreNames, import("./types").DefaultFileStoreNames>) => Promise<import("./types").StoresInstance<import("./types").DefaultDataStoreNames, import("./types").DefaultFileStoreNames>>;
        persist: (stores: import("./types").StoresInstance<import("./types").DefaultDataStoreNames, import("./types").DefaultFileStoreNames>) => Promise<void>;
        listen: (stores: import("./types").StoresInstance<import("./types").DefaultDataStoreNames, import("./types").DefaultFileStoreNames>) => void;
        DefaultDataStores: import("./types").GenerateObject<import("./types").DefaultDataStoreNames, import("./types").DataStoreInstance>;
        DefautFileStores: import("./types").GenerateObject<import("./types").DefaultFileStoreNames, import("./types").FileStoreInstance>;
    };
    DataStore: {
        create: (options: import("./types").DataStoreOptions) => import("./types").DataStoreInstance;
        get: <T_9 = any>(dataStore: import("./types").DataStoreInstance, path?: string | undefined) => T_9;
        set: <T_10 = any>(dataStore: import("./types").DataStoreInstance, path: string, data: T_10) => void;
        remove: (dataStore: import("./types").DataStoreInstance, path: string) => void;
        has: (dataStore: import("./types").DataStoreInstance, path: string) => boolean;
        entries: <T_11 = any>(dataStore: import("./types").DataStoreInstance, path?: string | undefined) => [string, T_11][];
        values: <T_12 = any>(dataStore: import("./types").DataStoreInstance, path?: string | undefined) => T_12[];
        keys: <T_13 = any>(dataStore: import("./types").DataStoreInstance, path?: string | undefined) => string[];
        increment: (dataStore: import("./types").DataStoreInstance, path: string, stepNumber?: number) => number;
        decrement: (dataStore: import("./types").DataStoreInstance, path: string, stepNumber?: number) => number;
        pop: <T_14 = any>(dataStore: import("./types").DataStoreInstance, path: string) => T_14;
        shift: <T_15 = any>(dataStore: import("./types").DataStoreInstance, path: string) => T_15;
        push: <T_16 = any>(dataStore: import("./types").DataStoreInstance, path: string, ...data: T_16[]) => void;
        setAndGetKey: <T_17 = any>(dataStore: import("./types").DataStoreInstance, data: T_17) => string;
        update: <T_18 = any>(dataStore: import("./types").DataStoreInstance, path: string, data: T_18) => void;
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
        globalHookNames: string[];
        clone: <T_19 extends Record<string, import("./types").StepInstance<unknown>>>(hooks: T_19) => T_19;
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
        resolve: <T_20 = unknown>(trail: import("./types").TrailInstance, model: import("./types").ModelInstance<import("./types").JSONSchema>) => T_20 | undefined;
    };
    Trails: {
        create: (options: import("./types").TrailsOptions) => import("./types").TrailsInstance;
        getItems: (trails: import("./types").TrailsInstance) => Record<string, import("./types").TrailInstance>;
        getItemsList: (trails: import("./types").TrailsInstance) => import("./types").TrailInstance[];
    };
    TrailData: {
        getPath: <T_21 = unknown>(trailData: import("./types").TrailDataInstance, ref: Partial<{ [K_1 in Extract<keyof T_21, string> as `${import("./types").SnakeToCamelCase<K_1>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>, ...segments: string[]) => string;
        defaultUpdateMerger: (existingValue: any, newValue: any) => any;
    };
    TrailDataModel: {
        create: (options: import("./types").TrailDataModelOptions) => import("./types").TrailDataModelInstance;
        get: <T_22 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, ref: Partial<{ [K_2 in Extract<keyof T_22, string> as `${import("./types").SnakeToCamelCase<K_2>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("./types").TrailDataModelItem<T_22>;
        getItems: <T_23 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, ref?: Partial<{ [K_3 in Extract<keyof T_23, string> as `${import("./types").SnakeToCamelCase<K_3>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined) => Record<string, import("./types").TrailDataModelItem<unknown>>;
        getItemsList: <T_24 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, ref?: Partial<{ [K_4 in Extract<keyof T_24, string> as `${import("./types").SnakeToCamelCase<K_4>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined) => import("./types").TrailDataModelItem<unknown>[];
        getItemsListByStatus: (trailDataModel: import("./types").TrailDataModelInstance, status: import("./types").TrailDataModelItemStatus | import("./types").TrailDataModelItemStatus[], ref?: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined) => import("./types").TrailDataModelItem<unknown>[];
        getChildrenItemsList: <T_25 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, parentRef: Partial<{ [K_5 in Extract<keyof T_25, string> as `${import("./types").SnakeToCamelCase<K_5>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("./types").TrailDataModelItem<unknown>[];
        update: <T_26 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: Partial<T_26>, ref: Partial<{ [K_6 in Extract<keyof T_26, string> as `${import("./types").SnakeToCamelCase<K_6>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{ [K_6 in Extract<keyof T_26, string> as `${import("./types").SnakeToCamelCase<K_6>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        updatePartial: <T_27 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: Partial<T_27>, ref: Partial<{ [K_7 in Extract<keyof T_27, string> as `${import("./types").SnakeToCamelCase<K_7>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{ [K_7 in Extract<keyof T_27, string> as `${import("./types").SnakeToCamelCase<K_7>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        set: <T_28 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: T_28, ref?: Partial<{ [K_8 in Extract<keyof T_28, string> as `${import("./types").SnakeToCamelCase<K_8>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined) => Partial<{ [K_8 in Extract<keyof T_28, string> as `${import("./types").SnakeToCamelCase<K_8>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        setStatus: (trailDataModel: import("./types").TrailDataModelInstance, status: import("./types").TrailDataModelItemStatus, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => void;
        count: <T_29 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, ref: Partial<{ [K_9 in Extract<keyof T_29, string> as `${import("./types").SnakeToCamelCase<K_9>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => number;
        setPartial: <T_30 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: Partial<T_30>, ref: Partial<{ [K_10 in Extract<keyof T_30, string> as `${import("./types").SnakeToCamelCase<K_10>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{ [K_10 in Extract<keyof T_30, string> as `${import("./types").SnakeToCamelCase<K_10>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        boostrapItem: <T_31 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: T_31, ref?: Partial<{ [K_11 in Extract<keyof T_31, string> as `${import("./types").SnakeToCamelCase<K_11>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined) => Partial<import("./types").TrailDataModelItem<T_31>>;
        filterByStatus: (...statuses: import("./types").TrailDataModelItemStatus[]) => (value: any) => boolean;
        filterByPartial: (partial?: boolean | undefined) => (value: any) => boolean;
        groupByParentHash: (trailDataModel: import("./types").TrailDataModelInstance, items: import("./types").TrailDataModelItem<unknown>[]) => Map<string, import("./types").TrailDataModelItem<unknown>[]>;
        getExistingReference: <T_32 = unknown>(trailDataModel: import("./types").TrailDataModelInstance, data: T_32) => Partial<{ [K_12 in Extract<keyof T_32, string> as `${import("./types").SnakeToCamelCase<K_12>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined;
    };
    TrailDataRequests: {
        create: (options: import("./types").TrailDataRequestsOptions) => import("./types").TrailDataRequestsInstance;
        count: (trailDataRequests: import("./types").TrailDataRequestsInstance, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => number;
        get: (trailDataRequests: import("./types").TrailDataRequestsInstance, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("./types").TrailDataRequestItem;
        getItems: (trailDataRequests: import("./types").TrailDataRequestsInstance) => Record<string, import("./types").TrailDataRequestItem>;
        getItemsList: (trailDataRequests: import("./types").TrailDataRequestsInstance, ref?: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined) => import("./types").TrailDataRequestItem[];
        getReference: (trailDataRequests: import("./types").TrailDataRequestsInstance, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        set: (trailDataRequests: import("./types").TrailDataRequestsInstance, request: import("./types").RequestSource, ref?: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined) => Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        setStatus: (trailDataRequests: import("./types").TrailDataRequestsInstance, status: import("./types").TrailDataRequestItemStatus, ref: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => void;
        getItemsListByStatus: (trailDataRequests: import("./types").TrailDataRequestsInstance, status: import("./types").TrailDataRequestItemStatus | import("./types").TrailDataRequestItemStatus[], ref?: Partial<{} & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }> | undefined) => import("./types").TrailDataRequestItem[];
        filterByFlowStart: (item: import("./types").TrailDataRequestItem) => boolean;
    };
    RequestMeta: {
        create: (requestOrRequestContext?: import("./types").RequestContext | import("./types").RequestSource | undefined) => import("./types").RequestMetaInstance;
        extend: (requestMeta: import("./types").RequestMetaInstance, ...metadata: Partial<import("./types").RequestMetaData>[]) => import("./types").RequestMetaInstance;
        contextDefaulted: (context?: import("./types").RequestContext | undefined) => import("./types").RequestContext;
    };
    Orchestrator: {
        create: (actor: import("./types").ActorInstance) => import("./types").OrchestratorInstance;
        run: (orchestrator: import("./types").OrchestratorInstance, context: import("./types").RequestContext, api: any) => Promise<void>;
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
        clone: <T_33>(input: T_33) => T_33;
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
        withinObjects: <T_34 extends Record<string, any>>(search: import("./types").SearchInstance, path: string, items: T_34[], query: string) => T_34[];
        withinTexts: (search: import("./types").SearchInstance, items: string[], query: string) => string[];
        withinTextsAsIndexes: (search: import("./types").SearchInstance, items: string[], query: string) => (string | number)[];
    };
    UrlPattern: {
        create: (options: import("./types").UrlPatternOptions) => import("./types").UrlPatternInstance;
        parse: (urlPattern: import("./types").UrlPatternInstance, url: string) => import("./types").UrlPatternParsed | undefined;
        parseAny: (urlPatterns: import("./types").UrlPatternInstance[], url: string) => import("./types").UrlPatternParsed | undefined;
        stringify: (urlPattern: import("./types").UrlPatternInstance, data: Record<string, string>) => string | false;
        find: (urlPatterns: import("./types").UrlPatternInstance[], url: string) => void | import("./types").UrlPatternInstance;
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