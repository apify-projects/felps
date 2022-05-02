import { ActorInstance, RequestContext, StepInstance, StepOptions } from './types';
export declare const create: <Methods = unknown>(options?: StepOptions<Methods> | undefined) => StepInstance<Methods>;
export declare const on: (step: StepInstance, handler: () => void) => {
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
export declare const extend: <Methods = unknown>(step: StepInstance, options: StepOptions<Methods>) => {
    crawlerMode?: import("./types").RequestCrawlerMode | undefined;
    handler?: import("./types").StepOptionsHandler<Methods & import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
        type: "object";
    }>> & import("./types").StepApiUtilsAPI> | undefined;
    errorHandler?: import("./types").StepOptionsHandler<Methods & import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
        type: "object";
    }>> & import("./types").StepApiUtilsAPI> | undefined;
    requestErrorHandler?: import("./types").StepOptionsHandler<Methods & import("./types").StepApiMetaAPI<import("./types").InputDefinition<{
        type: "object";
    }>> & import("./types").StepApiUtilsAPI> | undefined;
    name: string;
    uid?: string | undefined;
    key?: string | undefined;
    id: string;
};
export declare const run: (step: StepInstance | undefined, actor: ActorInstance, context: RequestContext | undefined) => Promise<void>;
declare const _default: {
    create: <Methods = unknown>(options?: StepOptions<Methods> | undefined) => StepInstance<Methods>;
    on: (step: StepInstance<unknown>, handler: () => void) => {
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
    extend: <Methods_1 = unknown>(step: StepInstance<unknown>, options: StepOptions<Methods_1>) => {
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
    run: (step: StepInstance<unknown> | undefined, actor: ActorInstance, context: RequestContext | undefined) => Promise<void>;
};
export default _default;
//# sourceMappingURL=step.d.ts.map