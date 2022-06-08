import Base from '@usefelps/core--instance-base';
import Actor from '@usefelps/core--actor';
import Crawler from '@usefelps/core--crawler';
import Flow from '@usefelps/core--flow';
import FlowCollection from '@usefelps/core--flow-collection';
import Step from '@usefelps/core--step';
import StepCollection from '@usefelps/core--step-collection';
import StepApi from '@usefelps/core--step-api';
import StepApiFlow from '@usefelps/core--step-api--flow';
import StepApiMeta from '@usefelps/core--step-api--meta';
import StepApiModel from '@usefelps/core--step-api--model';
import StepApiHelpers from '@usefelps/core--step-api--helpers';
import Model from '@usefelps/core--model';
import ModelCollection from '@usefelps/core--model-collection';
import DataStore from '@usefelps/core--store--data';
import FileStore from '@usefelps/core--store--file';
import StoreCollection from '@usefelps/core--store-collection';
import Queue from '@usefelps/core--queue';
import QueueCollection from '@usefelps/core--queue-collection';
import Dataset from '@usefelps/core--dataset';
import DatasetCollection from '@usefelps/core--dataset-collection';
import HookCollection from '@usefelps/core--hook-collection';
import Events from '@usefelps/core--events';
import Trail from '@usefelps/core--trail';
import Trails from '@usefelps/core--trail-collection';
import TrailData from '@usefelps/core--trail--data';
import TrailDataModel from '@usefelps/core--trail--data-model';
import TrailDataRequests from '@usefelps/core--trail--data-requests';
import RequestMeta from '@usefelps/core--request-meta';
import Orchestrator from '@usefelps/core--orchestrator';
import Input from '@usefelps/core--input';
import Search from '@usefelps/helper--search';
import UrlPattern from '@usefelps/helper--url-pattern';
import Logger from '@usefelps/helper--logger';
import Mutable from '@usefelps/helper--mutable';
import CustomRequestQueue from '@usefelps/custom--request-queue';
import CustomPlaywrightCrawler from '@usefelps/custom--crawler--playwright';
import KvStoreAdapter from '@usefelps/adapter--kv-store';
import ApifyKvStoreAdapter from '@usefelps/adapter--kv-store--apify';
import InMemoryKvStoreAdapter from '@usefelps/adapter--kv-store--in-memory';
export { Base, Actor, Crawler, FlowCollection, Flow, StepCollection, Step, StepApi, StepApiFlow, StepApiMeta, StepApiModel, StepApiHelpers, ModelCollection, Model, StoreCollection, DataStore, FileStore, QueueCollection, Queue, DatasetCollection, Dataset, HookCollection, Events, Trail, Trails, TrailData, TrailDataModel, TrailDataRequests, RequestMeta, Orchestrator, Input, Search, UrlPattern, Logger, Mutable, CustomRequestQueue, CustomPlaywrightCrawler, KvStoreAdapter, ApifyKvStoreAdapter, InMemoryKvStoreAdapter, };
declare const _default: {
    Base: {
        create: (options: import("@usefelps/types").BaseOptions) => import("@usefelps/types").BaseInstance;
    };
    Actor: {
        create: (options: import("@usefelps/types").ActorOptions) => import("@usefelps/types").ActorInstance;
        extend: (actor: import("@usefelps/types").ActorInstance, options?: Partial<import("@usefelps/types").ActorOptions>) => import("@usefelps/types").ActorInstance;
        run: (actor: import("@usefelps/types").ActorInstance, input: import("@usefelps/types").ActorInput, crawlerOptions?: import("apify").PlaywrightCrawlerOptions) => Promise<void>;
        prefix: (actor: import("@usefelps/types").ActorInstance, text: string) => string;
        combine: (actor: import("@usefelps/types").ActorInstance, ...actors: import("@usefelps/types").ActorInstance[]) => import("@usefelps/types").ActorInstance;
    };
    Crawler: {
        create: (options?: import("@usefelps/types").CrawlerOptions) => import("@usefelps/types").CrawlerInstance;
        run: (crawler: import("@usefelps/types").CrawlerInstance, crawlerOptions?: import("apify").PlaywrightCrawlerOptions) => Promise<import("@usefelps/types").CrawlerInstance>;
    };
    FlowCollection: {
        create: <F extends Record<string, import("@usefelps/types").FlowDefinition<string>>>({ FLOWS }: {
            FLOWS: F;
        }) => Record<keyof F, import("@usefelps/types").FlowInstance<string>>;
        use: <S extends Record<string, Partial<Pick<import("@usefelps/types").StepInstance<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
            type: "object";
        }>> & import("@usefelps/types").StepApiHelpersAPI>, "crawlerOptions">>>, M extends Record<string, import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchema>>>(_: {
            STEPS: S;
            MODELS?: M;
        }) => {
            define: <T extends Record<string, import("@usefelps/types").FlowDefinition<keyof S>>>(flows: T) => T;
        };
        names: <F_1 extends Record<string, import("@usefelps/types").FlowDefinition<string>>>(FLOWS: F_1) => import("@usefelps/types").FlowNamesObject<F_1>;
        clone: <T_1>(flows: T_1) => T_1;
    };
    Flow: {
        create: <StepNames = string>(options: import("@usefelps/types").FlowOptions<StepNames>) => import("@usefelps/types").FlowInstance<StepNames>;
        has: <StepNames_1 = unknown>(flow: import("@usefelps/types").FlowInstance<StepNames_1>, stepName: StepNames_1) => boolean;
    };
    StepCollection: {
        create: <M_1 extends Record<string, import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchema>>, F_2 extends Record<string, import("@usefelps/types").FlowDefinition<keyof StepDefinitions>>, StepDefinitions extends Record<string, Partial<Pick<import("@usefelps/types").StepInstance<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
            type: "object";
        }>> & import("@usefelps/types").StepApiHelpersAPI>, "crawlerOptions">>>, I extends import("@usefelps/types").InputDefinition<{
            type: "object";
        }>>({ STEPS }: {
            MODELS?: M_1;
            FLOWS?: F_2;
            STEPS: StepDefinitions;
            INPUT: I;
        }) => import("@usefelps/types").StepCollectionInstance<M_1, F_2, StepDefinitions, I>;
        define: <T_2 extends Record<string, Partial<Pick<import("@usefelps/types").StepInstance<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
            type: "object";
        }>> & import("@usefelps/types").StepApiHelpersAPI>, "crawlerOptions">>>>(steps: T_2) => import("@usefelps/types").StepDefinitions<T_2>;
        clone: <T_1_1>(hooks: T_1_1) => T_1_1;
    };
    Step: {
        create: <Methods = unknown>(options?: import("@usefelps/types").StepOptions<Methods>) => import("@usefelps/types").StepInstance<Methods>;
        on: (step: import("@usefelps/types").StepInstance<unknown>, handler: () => void) => {
            handler: () => void;
            name: string;
            crawlerOptions?: import("@usefelps/types").RequestCrawlerOptions;
            errorHandler?: import("@usefelps/types").StepOptionsHandler<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            requestErrorHandler?: import("@usefelps/types").StepOptionsHandler<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            afterHandler?: import("@usefelps/types").StepOptionsHandler<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            beforeHandler?: import("@usefelps/types").StepOptionsHandler<import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            actorKey?: string;
            uid?: string;
            key?: string;
            id: string;
        };
        extend: <Methods_1 = unknown>(step: import("@usefelps/types").StepInstance<unknown>, options: import("@usefelps/types").StepOptions<Methods_1>) => {
            crawlerOptions?: import("@usefelps/types").RequestCrawlerOptions;
            handler?: import("@usefelps/types").StepOptionsHandler<Methods_1 & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            errorHandler?: import("@usefelps/types").StepOptionsHandler<Methods_1 & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            requestErrorHandler?: import("@usefelps/types").StepOptionsHandler<Methods_1 & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            afterHandler?: import("@usefelps/types").StepOptionsHandler<Methods_1 & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            beforeHandler?: import("@usefelps/types").StepOptionsHandler<Methods_1 & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>> & import("@usefelps/types").StepApiHelpersAPI>;
            actorKey?: string;
            name: string;
            uid?: string;
            key?: string;
            id: string;
        };
        run: (step: import("@usefelps/types").StepInstance<unknown>, actor: import("@usefelps/types").ActorInstance, context: import("@usefelps/types").RequestContext) => Promise<void>;
    };
    StepApi: {
        create: <F_3 extends Record<string, import("@usefelps/types").FlowDefinition<keyof S_1>>, S_1, M_2 extends Record<string, import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchema>>, I_1 extends import("@usefelps/types").InputDefinition<{
            type: "object";
        }>>(actor: import("@usefelps/types").ActorInstance) => (context: import("@usefelps/types").RequestContext) => import("@usefelps/types").StepApiInstance<F_3, S_1, M_2, I_1, "NO_STEPNAME">;
    };
    StepApiFlow: {
        create: <F_4 extends Record<string, import("@usefelps/types").FlowDefinition<keyof S_2>>, S_2, M_3 extends Record<string, import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchema>>>(actor: import("@usefelps/types").ActorInstance) => import("@usefelps/types").StepApiFlowsInstance<F_4, S_2, M_3>;
    };
    StepApiMeta: {
        create: (actor: import("@usefelps/types").ActorInstance) => import("@usefelps/types").StepApiMetaInstance;
    };
    StepApiModel: {
        create: <M_4 extends Record<string, import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchema>>>(actor: import("@usefelps/types").ActorInstance) => import("@usefelps/types").StepApiModelInstance<M_4>;
    };
    StepApiHelpers: {
        create: () => import("@usefelps/types").StepApiHelpersInstance;
    };
    ModelCollection: {
        create: <M_5 extends Record<string, import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchema>>>({ MODELS }: {
            MODELS: M_5;
        }) => M_5;
        define: <T_3 extends Record<string, import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchemaWithMethods>>>(models: T_3) => T_3;
        clone: <T_1_2>(models: T_1_2) => T_1_2;
    };
    Model: {
        create: (options: import("@usefelps/types").ModelOptions<import("@usefelps/types").JSONSchema>) => import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>;
        define: <T_4 extends import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchemaWithMethods>>(model: T_4) => T_4;
        dependency: (model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, modelName: string) => import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>;
        dependencies: (model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>) => import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>[];
        referenceKeys: (model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>) => string[];
        referenceFor: (model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, ref: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>, options?: {
            withOwnReferenceKey?: boolean;
            includeNotFound?: boolean;
        }) => Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        referenceValue: (model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, ref: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => string;
        find: (model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, items: import("@usefelps/types").TrailDataModelItem<any>[], newItem: import("@usefelps/types").TrailDataModelItem<any>) => import("@usefelps/types").TrailDataModelItem<any>;
        validate: <T_1_3 = unknown>(model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, data: T_1_3, options?: import("@usefelps/types").ValidatorValidateOptions) => {
            valid: boolean;
            errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
        };
        validateReference: <T_2 = unknown>(model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, ref: Partial<{ [K in Extract<keyof T_2, string> as `${import("@usefelps/types").SnakeToCamelCase<K>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>, options?: import("@usefelps/types").ValidatorValidateOptions) => {
            valid: boolean;
            errors: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
        };
        connect: ({ api }: {
            api: import("@usefelps/types").GeneralStepApi<import("@usefelps/types").InputDefinition<{
                type: "object";
            }>>;
        }) => {
            organizeList(model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, items: import("@usefelps/types").TrailDataModelItem<any>[]): Promise<{
                valid: import("@usefelps/types").TrailDataModelItem<unknown>[];
                invalid: import("@usefelps/types").TrailDataModelItem<unknown>[];
            }>;
            isListComplete(model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, items: import("@usefelps/types").TrailDataModelItem<unknown>[]): Promise<boolean>;
        };
        walk: (model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>, walker: (key: string, value: any) => void) => void;
        flatten: (model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>) => import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>[];
        schemaAsRaw: <T_3>(schema: T_3) => T_3;
        schemaWithoutRequired: <T_4 extends import("@usefelps/types").JSONSchema>(schema: T_4) => T_4;
    };
    StoreCollection: {
        create: (options?: import("@usefelps/types").StoreCollectionOptions) => import("@usefelps/types").StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>;
        load: (stores: import("@usefelps/types").StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>) => Promise<import("@usefelps/types").StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>>;
        persist: (stores: import("@usefelps/types").StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>) => Promise<void>;
        listen: (stores: import("@usefelps/types").StoreCollectionInstance<import("@usefelps/types").DefaultDataStoreNames, import("@usefelps/types").DefaultFileStoreNames>) => void;
        DefaultDataStores: ({
            name: string;
            kvKey: string;
            splitByKey?: undefined;
        } | {
            name: string;
            kvKey: string;
            splitByKey: boolean;
        })[];
        DefautFileStores: {
            name: string;
            kvKey: string;
        }[];
    };
    DataStore: {
        create: (options: import("@usefelps/types").DataStoreOptions) => import("@usefelps/types").DataStoreInstance;
        get: <T_5 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path?: string) => T_5;
        set: <T_1_4 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path: string, data: T_1_4) => void;
        remove: (dataStore: import("@usefelps/types").DataStoreInstance, path: string) => void;
        has: (dataStore: import("@usefelps/types").DataStoreInstance, path: string) => boolean;
        entries: <T_2_1 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path?: string) => [string, T_2_1][];
        values: <T_3_1 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path?: string) => T_3_1[];
        keys: <T_4_1 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path?: string) => string[];
        increment: (dataStore: import("@usefelps/types").DataStoreInstance, path: string, stepNumber?: number) => number;
        decrement: (dataStore: import("@usefelps/types").DataStoreInstance, path: string, stepNumber?: number) => number;
        pop: <T_5 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path: string) => T_5;
        shift: <T_6 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path: string) => T_6;
        push: <T_7 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path: string, ...data: T_7[]) => void;
        setAndGetKey: <T_8 = any>(dataStore: import("@usefelps/types").DataStoreInstance, data: T_8) => string;
        update: <T_9 = any>(dataStore: import("@usefelps/types").DataStoreInstance, path: string, data: T_9) => void;
        load: (dataStore: import("@usefelps/types").DataStoreInstance) => Promise<import("@usefelps/types").DataStoreInstance>;
        persist: (dataStore: import("@usefelps/types").DataStoreInstance) => Promise<void>;
        listen: (dataStore: import("@usefelps/types").DataStoreInstance) => void;
    };
    FileStore: {
        create: (options: import("@usefelps/types").FileStoreOptions) => import("@usefelps/types").FileStoreInstance;
        load: (fileStore: import("@usefelps/types").FileStoreInstance) => Promise<import("@usefelps/types").FileStoreInstance>;
        get: (fileStore: import("@usefelps/types").FileStoreInstance, key: string) => Promise<import("apify").KeyValueStoreValueTypes>;
        set: <TValue extends object = any>(fileStore: import("@usefelps/types").FileStoreInstance, key: string, value: TValue, options?: {
            contentType?: string;
        }) => Promise<void>;
    };
    QueueCollection: {
        create: <Names extends string[] = []>(options?: import("@usefelps/types").QueueCollectionOptions<Names>) => import("@usefelps/types").QueueCollectionInstance<Names>;
        DefaultQueueCollection: {
            default: import("@usefelps/types").QueueInstance;
        };
    };
    Queue: {
        create: (options?: import("@usefelps/types").QueueOptions) => import("@usefelps/types").QueueInstance;
        load: (queue: import("@usefelps/types").QueueInstance, options?: {
            forceCloud?: boolean;
        }) => Promise<import("@usefelps/types").QueueInstance>;
        add: (queue: import("@usefelps/types").QueueInstance, request: import("@usefelps/types").RequestSource, options?: {
            priority?: number;
            crawlerOptions?: import("@usefelps/types").RequestCrawlerOptions;
            forefront?: boolean;
        }) => Promise<import("apify").QueueOperationInfo>;
    };
    DatasetCollection: {
        create: <Names_1 extends string[] = []>(options?: import("@usefelps/types").DatasetCollectionOptions<Names_1>) => import("@usefelps/types").DatasetCollectionInstance<Names_1>;
        close: <Names_1 extends string[] = []>(datasets: import("@usefelps/types").DatasetCollectionInstance<Names_1>) => Promise<void>;
    };
    Dataset: {
        create: (options: import("@usefelps/types").DatasetOptions) => import("@usefelps/types").DatasetInstance;
        load: (dataset: import("@usefelps/types").DatasetInstance) => Promise<import("@usefelps/types").DatasetInstance>;
        push: (dataset: import("@usefelps/types").DatasetInstance, data: any) => Promise<void>;
        close: (dataset: import("@usefelps/types").DatasetInstance) => Promise<void>;
    };
    HookCollection: {
        create: <M_6 extends Record<string, import("@usefelps/types").ModelDefinition<import("@usefelps/types").JSONSchema>>, F_5 extends Record<string, import("@usefelps/types").FlowDefinition<keyof S_3>>, S_3, I_2 extends import("@usefelps/types").InputDefinition<{
            type: "object";
        }>>(_: {
            MODELS?: M_6;
            FLOWS?: F_5;
            STEPS: S_3;
            INPUT: I_2;
        }) => import("@usefelps/types").HooksInstance<M_6, F_5, S_3, I_2>;
        globalHookNames: string[];
        clone: <T_10 extends Record<string, import("@usefelps/types").StepInstance<unknown>>>(hooks: T_10) => T_10;
    };
    Events: {
        create: (options: import("@usefelps/types").EventsOptions) => import("@usefelps/types").EventsInstance;
        emit: (events: import("@usefelps/types").EventsInstance, eventName: string, ...args: any[]) => void;
        on: (events: import("@usefelps/types").EventsInstance, eventName: string, callback: (...args: any[]) => void) => void;
        once: (events: import("@usefelps/types").EventsInstance, eventName: string, callback: (...args: any[]) => void) => void;
        batch: (events: import("@usefelps/types").EventsInstance, eventName: string, callback: (events: any[]) => void, options?: {
            size: number;
        }) => void;
        close: (events: import("@usefelps/types").EventsInstance) => Promise<void>;
    };
    Trail: {
        create: (options: import("@usefelps/types").TrailOptions) => import("@usefelps/types").TrailInstance;
        createFrom: (request: import("@usefelps/types").RequestSource, options: import("@usefelps/types").TrailOptions) => import("@usefelps/types").TrailInstance;
        load: (trail: import("@usefelps/types").TrailInstance) => Promise<import("@usefelps/types").TrailInstance>;
        get: (trail: import("@usefelps/types").TrailInstance) => import("@usefelps/types").TrailState;
        setRequest: (trail: import("@usefelps/types").TrailInstance, request: any) => void;
        getMainFlow: (trail: import("@usefelps/types").TrailInstance) => import("@usefelps/types").TrailFlowState;
        setFlow: (trail: import("@usefelps/types").TrailInstance, flowState: import("@usefelps/types").TrailFlowState) => string;
        getFlow: (trail: import("@usefelps/types").TrailInstance, flowKey: string) => import("@usefelps/types").TrailFlowState;
        ingested: (trail: import("@usefelps/types").TrailInstance) => import("@usefelps/types").TrailDataStage;
        digested: (trail: import("@usefelps/types").TrailInstance) => import("@usefelps/types").TrailDataStage;
        modelOfStage: (trailStage: import("@usefelps/types").TrailDataStage, modelName: string) => import("@usefelps/types").TrailDataModelInstance;
        promote: (trail: import("@usefelps/types").TrailInstance, item: import("@usefelps/types").TrailDataModelItem<unknown> | import("@usefelps/types").TrailDataRequestItem) => void;
        resolve: <T_11 = unknown>(trail: import("@usefelps/types").TrailInstance, model: import("@usefelps/types").ModelInstance<import("@usefelps/types").JSONSchema>) => T_11;
        getEntities: (trail: import("@usefelps/types").TrailInstance, modelName: string, ref?: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("@usefelps/types").TrailDataModelItem<unknown>[];
    };
    Trails: {
        create: (options: import("@usefelps/types").TrailsOptions) => import("@usefelps/types").TrailsInstance;
        getItems: (trails: import("@usefelps/types").TrailsInstance) => Record<string, import("@usefelps/types").TrailInstance>;
        getItemsList: (trails: import("@usefelps/types").TrailsInstance) => import("@usefelps/types").TrailInstance[];
    };
    TrailData: {
        getPath: <T_12 = unknown>(trailData: import("@usefelps/types").TrailDataInstance, ref: Partial<{ [K_1 in Extract<keyof T_12, string> as `${import("@usefelps/types").SnakeToCamelCase<K_1>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>, ...segments: string[]) => string;
        defaultUpdateMerger: (existingValue: any, newValue: any) => any;
    };
    TrailDataModel: {
        create: (options: import("@usefelps/types").TrailDataModelOptions) => import("@usefelps/types").TrailDataModelInstance;
        get: <T_13 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, ref: Partial<{ [K_2 in Extract<keyof T_13, string> as `${import("@usefelps/types").SnakeToCamelCase<K_2>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("@usefelps/types").TrailDataModelItem<T_13>;
        getItems: <T_1_5 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, ref?: Partial<{ [K_1 in Extract<keyof T_1_5, string> as `${import("@usefelps/types").SnakeToCamelCase<K_1>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Record<string, import("@usefelps/types").TrailDataModelItem<unknown>>;
        getItemsList: <T_2_2 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, ref?: Partial<{ [K_2 in Extract<keyof T_2_2, string> as `${import("@usefelps/types").SnakeToCamelCase<K_2>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("@usefelps/types").TrailDataModelItem<unknown>[];
        getItemsListByStatus: (trailDataModel: import("@usefelps/types").TrailDataModelInstance, status: import("@usefelps/types").TrailDataModelItemStatus | import("@usefelps/types").TrailDataModelItemStatus[], ref?: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("@usefelps/types").TrailDataModelItem<unknown>[];
        getChildrenItemsList: <T_3_2 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, parentRef: Partial<{ [K_3 in Extract<keyof T_3_2, string> as `${import("@usefelps/types").SnakeToCamelCase<K_3>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("@usefelps/types").TrailDataModelItem<unknown>[];
        update: <T_4_2 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, data: Partial<T_4_2>, ref: Partial<{ [K_4 in Extract<keyof T_4_2, string> as `${import("@usefelps/types").SnakeToCamelCase<K_4>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{ [K_4_1 in Extract<keyof T_4_2, string> as `${import("@usefelps/types").SnakeToCamelCase<K_4_1>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        updatePartial: <T_5_1 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, data: Partial<T_5_1>, ref: Partial<{ [K_5 in Extract<keyof T_5_1, string> as `${import("@usefelps/types").SnakeToCamelCase<K_5>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{ [K_5_1 in Extract<keyof T_5_1, string> as `${import("@usefelps/types").SnakeToCamelCase<K_5_1>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        set: <T_6_1 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, data: T_6_1, ref?: Partial<{ [K_6 in Extract<keyof T_6_1, string> as `${import("@usefelps/types").SnakeToCamelCase<K_6>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{ [K_6_1 in Extract<keyof T_6_1, string> as `${import("@usefelps/types").SnakeToCamelCase<K_6_1>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        setStatus: (trailDataModel: import("@usefelps/types").TrailDataModelInstance, status: import("@usefelps/types").TrailDataModelItemStatus, ref: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => void;
        count: <T_7_1 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, ref: Partial<{ [K_7 in Extract<keyof T_7_1, string> as `${import("@usefelps/types").SnakeToCamelCase<K_7>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => number;
        setPartial: <T_8_1 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, data: Partial<T_8_1>, ref: Partial<{ [K_8 in Extract<keyof T_8_1, string> as `${import("@usefelps/types").SnakeToCamelCase<K_8>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{ [K_8_1 in Extract<keyof T_8_1, string> as `${import("@usefelps/types").SnakeToCamelCase<K_8_1>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        boostrapItem: <T_9_1 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, data: T_9_1, ref?: Partial<{ [K_9 in Extract<keyof T_9_1, string> as `${import("@usefelps/types").SnakeToCamelCase<K_9>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<import("@usefelps/types").TrailDataModelItem<T_9_1>>;
        filterByStatus: (...statuses: import("@usefelps/types").TrailDataModelItemStatus[]) => (value: any) => boolean;
        filterByPartial: (partial?: boolean) => (value: any) => boolean;
        groupByParentHash: (trailDataModel: import("@usefelps/types").TrailDataModelInstance, items: import("@usefelps/types").TrailDataModelItem<unknown>[]) => Map<string, import("@usefelps/types").TrailDataModelItem<unknown>[]>;
        getExistingReference: <T_10 = unknown>(trailDataModel: import("@usefelps/types").TrailDataModelInstance, data: T_10) => Partial<{ [K_10 in Extract<keyof T_10, string> as `${import("@usefelps/types").SnakeToCamelCase<K_10>}Key`]: string; } & {
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
    };
    TrailDataRequests: {
        create: (options: import("@usefelps/types").TrailDataRequestsOptions) => import("@usefelps/types").TrailDataRequestsInstance;
        count: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance, ref: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => number;
        get: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance, ref: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("@usefelps/types").TrailDataRequestItem;
        getItems: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance) => Record<string, import("@usefelps/types").TrailDataRequestItem>;
        getItemsList: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance, ref?: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("@usefelps/types").TrailDataRequestItem[];
        getReference: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance, ref: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        set: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance, request: import("@usefelps/types").RequestSource, ref?: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>;
        setStatus: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance, status: import("@usefelps/types").TrailDataRequestItemStatus, ref: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => void;
        getStatus: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance, ref: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => void;
        getItemsListByStatus: (trailDataRequests: import("@usefelps/types").TrailDataRequestsInstance, status: import("@usefelps/types").TrailDataRequestItemStatus | import("@usefelps/types").TrailDataRequestItemStatus[], ref?: Partial<{
            fRequestKey: string;
            fTrailKey: string;
            fFlowKey: string;
            fActorKey: string;
        }>) => import("@usefelps/types").TrailDataRequestItem[];
        filterByFlowStart: (item: import("@usefelps/types").TrailDataRequestItem) => boolean;
    };
    RequestMeta: {
        create: (requestOrRequestContext?: import("@usefelps/types").RequestSource | import("@usefelps/types").RequestContext) => import("@usefelps/types").RequestMetaInstance;
        extend: (requestMeta: import("@usefelps/types").RequestMetaInstance, ...metadata: Partial<import("@usefelps/types").RequestMetaData>[]) => import("@usefelps/types").RequestMetaInstance;
        contextDefaulted: (context?: import("@usefelps/types").RequestContext) => import("@usefelps/types").RequestContext;
        cloneContext: (context: import("@usefelps/types").RequestContext) => import("@usefelps/types").RequestContext;
    };
    Orchestrator: {
        create: (actor: import("@usefelps/types").ActorInstance) => import("@usefelps/types").OrchestratorInstance;
        run: (orchestrator: import("@usefelps/types").OrchestratorInstance, context: import("@usefelps/types").RequestContext, api: any) => Promise<void>;
    };
    Input: {
        create: <I_3 extends import("@usefelps/types").InputDefinition<{
            type: "object";
        }>>({ INPUT }: {
            INPUT: I_3;
        }) => import("@usefelps/types").InputInstance<I_3["schema"]>;
        define: <I_1 extends import("@usefelps/types").InputDefinition<{
            type: "object";
        }>>(input: I_1) => I_1;
        clone: <T_14>(input: T_14) => T_14;
    };
    Search: {
        create: (options: import("@usefelps/types").SearchOptions) => {
            indexOptions: import("flexsearch").IndexOptions<string, false>;
            documentOptions: import("flexsearch").IndexOptionsForDocumentSearch<unknown, false>;
            uid?: string;
            key?: string;
            name: string;
            id: string;
        };
        withinObjects: <T_15 extends Record<string, any>>(search: import("@usefelps/types").SearchInstance, path: string, items: T_15[], query: string) => T_15[];
        withinTexts: (search: import("@usefelps/types").SearchInstance, items: string[], query: string) => string[];
        withinTextsAsIndexes: (search: import("@usefelps/types").SearchInstance, items: string[], query: string) => (string | number)[];
    };
    UrlPattern: {
        create: (options: import("@usefelps/types").UrlPatternOptions) => import("@usefelps/types").UrlPatternInstance;
        parse: (urlPattern: import("@usefelps/types").UrlPatternInstance, url: string) => import("@usefelps/types").UrlPatternParsed;
        parseAny: (urlPatterns: import("@usefelps/types").UrlPatternInstance[], url: string) => import("@usefelps/types").UrlPatternParsed;
        stringify: (urlPattern: import("@usefelps/types").UrlPatternInstance, data: Record<string, string>) => any;
        find: (urlPatterns: import("@usefelps/types").UrlPatternInstance[], url: string) => void | import("@usefelps/types").UrlPatternInstance;
    };
    Logger: {
        create: (element: {
            id: string;
        }, options?: import("@usefelps/types").LoggerOptions) => import("@usefelps/types").LoggerInstance;
        setLevel: (level: "ERROR" | "DEBUG" | "INFO") => void;
        debug: (logger: import("@usefelps/types").LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
        start: (logger: import("@usefelps/types").LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
        end: (logger: import("@usefelps/types").LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
        info: (logger: import("@usefelps/types").LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
        error: (logger: import("@usefelps/types").LoggerInstance, messages?: string | string[], data?: Record<string, any>) => void;
    };
    Mutable: {
        extend: <I_4>(...instances: I_4[]) => {
            with: (options: Partial<I_4>) => I_4[];
        };
    };
    CustomRequestQueue: typeof CustomRequestQueue;
    CustomPlaywrightCrawler: typeof CustomPlaywrightCrawler;
    KvStoreAdapter: {
        create: <T_16 = any>(options: import("@usefelps/types").KVStoreAdapterOptions<any>) => import("@usefelps/types").KVStoreAdapterInstance<T_16>;
        load: (adapter: import("@usefelps/types").KVStoreAdapterInstance<any>) => Promise<{
            resource: any;
            init?: (...args: any[]) => any;
            get: (connectedKv: import("@usefelps/types").KVStoreAdapterInstance<any>, key: string) => Promise<any>;
            set: (connectedKv: import("@usefelps/types").KVStoreAdapterInstance<any>, key: string, value: any, options: any) => Promise<any>;
            list: (connectedKv: import("@usefelps/types").KVStoreAdapterInstance<any>, prefix?: string, options?: any) => Promise<import("@usefelps/types").KVStoreAdapterListResult>;
            uid?: string;
            key?: string;
            name: string;
            id: string;
        }>;
        get: <T_1_6 = any>(adapter: import("@usefelps/types").KVStoreAdapterInstance<T_1_6>, key: string) => Promise<T_1_6>;
        set: <T_2_3 = any>(adapter: import("@usefelps/types").KVStoreAdapterInstance<T_2_3>, key: string, value: any, options?: any) => Promise<string>;
        list: <T_3_3 = any>(adapter: import("@usefelps/types").KVStoreAdapterInstance<T_3_3>, prefix?: string, options?: any) => Promise<import("@usefelps/types").KVStoreAdapterListResult>;
    };
    ApifyKvStoreAdapter: () => import("@usefelps/types").KVStoreAdapterInstance<any>;
    InMemoryKvStoreAdapter: () => import("@usefelps/types").KVStoreAdapterInstance<any>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map