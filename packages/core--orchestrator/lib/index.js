"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.create = void 0;
const tslib_1 = require("tslib");
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__dataset_1 = tslib_1.__importDefault(require("@usefelps/core--dataset"));
const core__flow_1 = tslib_1.__importDefault(require("@usefelps/core--flow"));
const core__model_1 = tslib_1.__importDefault(require("@usefelps/core--model"));
const core__queue_1 = tslib_1.__importDefault(require("@usefelps/core--queue"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__step_1 = tslib_1.__importDefault(require("@usefelps/core--step"));
const core__step_api_1 = tslib_1.__importDefault(require("@usefelps/core--step-api"));
const core__store__data_1 = tslib_1.__importDefault(require("@usefelps/core--store--data"));
const core__trail_1 = tslib_1.__importDefault(require("@usefelps/core--trail"));
const core__trail__data_model_1 = tslib_1.__importDefault(require("@usefelps/core--trail--data-model"));
const core__trail__data_requests_1 = tslib_1.__importDefault(require("@usefelps/core--trail--data-requests"));
const core__trail_collection_1 = tslib_1.__importDefault(require("@usefelps/core--trail-collection"));
const utils = tslib_1.__importStar(require("@usefelps/helper--utils"));
const create = (actor) => {
    return {
        async handler(context) {
            const trails = core__trail_collection_1.default.create({ actor });
            const trail = core__trail_1.default.createFrom(context?.request, { actor });
            const ingest = core__trail_1.default.ingested(trail);
            const digest = core__trail_1.default.digested(trail);
            const meta = core__request_meta_1.default.create(context);
            const actorKey = meta.data.reference.fActorKey;
            // const flow = meta.data.flowName ? actor.flows?.[PREFIXED_NAME_BY_ACTOR(actorKey, meta.data.flowName)] as FlowInstance<ReallyAny> : undefined;
            const stepApi = core__step_api_1.default.create(actor);
            const api = stepApi(context);
            const connectedModel = core__model_1.default.connect({ api });
            const stoppedReferencesHashes = new Set();
            const allowedReferencesHashes = new Set();
            // Handle all new flow start requests
            for (const trailInstance of core__trail_collection_1.default.getItemsList(trails)) {
                const ingestLocal = core__trail_1.default.ingested(trailInstance);
                const digestLocal = core__trail_1.default.digested(trailInstance);
                const newRequests = core__trail__data_requests_1.default.getItemsList(ingestLocal.requests).filter(core__trail__data_requests_1.default.filterByFlowStart);
                for (const newRequest of newRequests) {
                    core__trail_1.default.promote(trailInstance, newRequest);
                    const metaLocal = core__request_meta_1.default.create(newRequest.source);
                    core__trail__data_requests_1.default.setStatus(digestLocal.requests, CONST.REQUEST_STATUS.QUEUED, metaLocal.data.reference);
                    try {
                        await core__queue_1.default.add(actor?.queues?.default, metaLocal.request, { crawlerOptions: metaLocal.data.crawlerOptions });
                    }
                    catch (error) {
                        core__trail__data_requests_1.default.setStatus(digest.requests, CONST.REQUEST_STATUS.CREATED, metaLocal.data.reference);
                    }
                }
            }
            const mainFlowName = core__trail_1.default.getMainFlow(trail)?.name;
            // Analyse the trail to determine which models are now stoped
            // if (!flow) { return; };
            if (!mainFlowName) {
                throw new Error(`No main flow found: ${mainFlowName}`);
            }
            ;
            const mainFlow = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, mainFlowName)];
            const outputModels = core__model_1.default.flatten(mainFlow?.output);
            for (const model of outputModels) {
                const ingestModel = ingest.models[model.name];
                if (ingestModel) {
                    const entities = core__trail__data_model_1.default.getItemsList(ingestModel);
                    // const entitiesByParentHash = TrailDataModel.groupByParentHash({ ...ingestModel, model }, entities);
                    const entitiesByParentHash = core__trail__data_model_1.default.groupByParentHash(ingestModel, entities);
                    for (const parentRefHash of entitiesByParentHash.keys()) {
                        const outputModel = core__model_1.default.dependency(mainFlow.output, model.name);
                        if (outputModel) {
                            const entitiesOrganised = await connectedModel.organizeList(outputModel, entitiesByParentHash.get(parentRefHash));
                            const listIsComplete = await connectedModel.isListComplete(outputModel, entitiesOrganised.valid);
                            // console.log({ model: model.name, stop})
                            if (listIsComplete) {
                                stoppedReferencesHashes.add(parentRefHash);
                                for (const entity of entitiesOrganised.valid) {
                                    allowedReferencesHashes.add(utils.hash(entity.reference));
                                }
                                // console.log(parentRefHash, entitiesByParentHash.get(parentRefHash))
                            }
                        }
                    }
                }
            }
            // REQUESTS ------------------------------------------------------
            // INGESTED Stage
            const newlyCreatedRequests = core__trail__data_requests_1.default.getItemsListByStatus(ingest.requests, ['CREATED', 'FAILED']);
            for (const newRequest of newlyCreatedRequests) {
                // TODO: Add filtering here
                // ...
                const metaLocal = core__request_meta_1.default.create(newRequest.source);
                const flowLocal = actor.flows?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, metaLocal.data.flowName)];
                const stepIsPartofFlow = !!flowLocal && core__flow_1.default.has(flowLocal, metaLocal.data.stepName);
                const referenceHash = utils.hash(metaLocal?.data?.reference);
                const requestIsLimited = stoppedReferencesHashes.has(referenceHash) && !allowedReferencesHashes.has(referenceHash);
                const requestShouldBeQueued = stepIsPartofFlow && !requestIsLimited;
                // console.log({
                //     ref: metaLocal?.data?.reference,
                //     hash: hash(metaLocal?.data?.reference),
                //     stepIsPartofFlow,
                //     flowLocal,
                //     requestIsLimited,
                //     requestShouldBeQueued,
                // });
                if (requestShouldBeQueued) {
                    core__trail_1.default.promote(trail, newRequest);
                }
                else {
                    core__trail__data_requests_1.default.setStatus(ingest.requests, CONST.REQUEST_STATUS.DISCARDED, metaLocal.data.reference);
                }
            }
            ;
            // DIGESTED Stage
            const newRequests = core__trail__data_requests_1.default.getItemsListByStatus(digest.requests, 'CREATED');
            for (const newRequest of newRequests) {
                const metaLocal = core__request_meta_1.default.create(newRequest.source);
                // TODO: Add filtering here
                // Check if need more data or not (to avoid unnecessary requests)
                if (metaLocal.data.reference) {
                    core__trail__data_requests_1.default.setStatus(digest.requests, CONST.REQUEST_STATUS.QUEUED, metaLocal.data.reference);
                    try {
                        await core__queue_1.default.add(actor?.queues?.default, metaLocal.request, { crawlerOptions: metaLocal.data.crawlerOptions });
                    }
                    catch (error) {
                        core__trail__data_requests_1.default.setStatus(digest.requests, CONST.REQUEST_STATUS.CREATED, metaLocal.data.reference);
                    }
                }
            }
            ;
            // REQUESTS DONE
            const remainingRequests = core__trail__data_requests_1.default.getItemsListByStatus(digest.requests, ['CREATED', 'QUEUED', 'STARTED', 'FAILED']);
            const trailEnded = remainingRequests.length === 0;
            if (trailEnded) {
                // Run FLOW_ENDED hook
                await core__step_1.default.run(actor?.hooks?.[CONST.PREFIXED_NAME_BY_ACTOR(actorKey, 'FLOW_ENDED')], actor, context);
                // MODELS ------------------------------------------------------------
                // Resolve models
                // INGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const items = core__trail__data_model_1.default.getItemsListByStatus(ingest.models[modelName], ['CREATED']);
                    const outputModel = core__model_1.default.dependency(mainFlow.output, modelName);
                    if (outputModel) {
                        const filteredAs = await connectedModel.organizeList(outputModel, items);
                        for (const validItem of filteredAs.valid) {
                            core__trail_1.default.promote(trail, validItem);
                        }
                        ;
                        for (const invalidItem of filteredAs.invalid) {
                            core__trail__data_model_1.default.setStatus(ingest.models[modelName], CONST.MODEL_STATUS.DISCARDED, invalidItem.reference);
                        }
                    }
                }
                // DIGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const newItems = core__trail__data_model_1.default.getItemsListByStatus(digest.models[modelName], ['CREATED']);
                    for (const newItem of newItems) {
                        core__trail__data_model_1.default.setStatus(digest.models[modelName], CONST.MODEL_STATUS.PUSHED, newItem.reference);
                    }
                }
                ;
                const results = core__trail_1.default.resolve(trail, mainFlow?.output);
                const resultsAsArray = Array.isArray(results) ? results : [results];
                for (const result of resultsAsArray) {
                    const { valid: isValid, errors } = core__model_1.default.validate(mainFlow.output, result);
                    const decoratedResults = isValid ? { success: true, ...result } : { errors, success: false, ...result };
                    const { valid: isDecoratedValid } = core__model_1.default.validate(mainFlow.output, decoratedResults);
                    if (isDecoratedValid) {
                        await core__dataset_1.default.push(actor?.datasets?.default, decoratedResults);
                    }
                    else {
                        core__store__data_1.default.setAndGetKey(actor?.stores?.incorrectDataset, decoratedResults);
                    }
                }
            }
        },
    };
};
exports.create = create;
const run = async (orchestrator, context, api) => {
    await orchestrator.handler(context, api);
};
exports.run = run;
exports.default = { create: exports.create, run: exports.run };
//# sourceMappingURL=index.js.map