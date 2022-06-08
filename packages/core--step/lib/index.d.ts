import { ActorInstance, RequestContext, StepInstance, StepOptions } from '@usefelps/types';
export declare const create: <Methods = unknown>(options?: StepOptions<Methods>) => StepInstance<Methods>;
export declare const on: (step: StepInstance, handler: () => void) => {
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
export declare const extend: <Methods = unknown>(step: StepInstance, options: StepOptions<Methods>) => {
    crawlerOptions?: import("@usefelps/types").RequestCrawlerOptions;
    handler?: import("@usefelps/types").StepOptionsHandler<Methods & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
        type: "object";
    }>> & import("@usefelps/types").StepApiHelpersAPI>;
    errorHandler?: import("@usefelps/types").StepOptionsHandler<Methods & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
        type: "object";
    }>> & import("@usefelps/types").StepApiHelpersAPI>;
    requestErrorHandler?: import("@usefelps/types").StepOptionsHandler<Methods & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
        type: "object";
    }>> & import("@usefelps/types").StepApiHelpersAPI>;
    afterHandler?: import("@usefelps/types").StepOptionsHandler<Methods & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
        type: "object";
    }>> & import("@usefelps/types").StepApiHelpersAPI>;
    beforeHandler?: import("@usefelps/types").StepOptionsHandler<Methods & import("@usefelps/types").StepApiMetaAPI<import("@usefelps/types").InputDefinition<{
        type: "object";
    }>> & import("@usefelps/types").StepApiHelpersAPI>;
    actorKey?: string;
    name: string;
    uid?: string;
    key?: string;
    id: string;
};
export declare const run: (step: StepInstance | undefined, actor: ActorInstance, context: RequestContext | undefined) => Promise<void>;
declare const _default: {
    create: <Methods = unknown>(options?: StepOptions<Methods>) => StepInstance<Methods>;
    on: (step: StepInstance<unknown>, handler: () => void) => {
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
    extend: <Methods_1 = unknown>(step: StepInstance<unknown>, options: StepOptions<Methods_1>) => {
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
    run: (step: StepInstance<unknown>, actor: ActorInstance, context: RequestContext) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map