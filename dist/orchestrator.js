"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.create = void 0;
const tslib_1 = require("tslib");
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const _1 = require(".");
const consts_1 = require("./consts");
const trail_data_model_1 = tslib_1.__importDefault(require("./trail-data-model"));
const trail_data_requests_1 = tslib_1.__importDefault(require("./trail-data-requests"));
const create = (actor) => {
    return {
        async handler(context) {
            const trails = _1.Trails.create({ actor });
            const trail = _1.Trail.createFrom(context?.request, { actor });
            const ingest = _1.Trail.ingested(trail);
            const digest = _1.Trail.digested(trail);
            const meta = _1.RequestMeta.create(context);
            const actorKey = meta.data.reference.fActorKey;
            const flow = meta.data.flowName ? actor.flows?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, meta.data.flowName)] : undefined;
            const stepApi = _1.StepApi.create(actor);
            const api = stepApi(context);
            const connectedModel = _1.Model.connect({ api });
            const stopedReferencesHashes = new Set();
            // Handle all new flow start requests
            for (const trailInstance of _1.Trails.getItemsList(trails)) {
                const ingestLocal = _1.Trail.ingested(trailInstance);
                const digestLocal = _1.Trail.digested(trailInstance);
                const newRequests = trail_data_requests_1.default.getItemsList(ingestLocal.requests).filter(trail_data_requests_1.default.filterByFlowStart);
                for (const newRequest of newRequests) {
                    _1.Trail.promote(trailInstance, newRequest);
                    const metaLocal = _1.RequestMeta.create(newRequest.source);
                    await _1.Queue.add(actor?.queues?.default, metaLocal.request, { type: metaLocal.data.crawlerMode });
                    trail_data_requests_1.default.setStatus(digestLocal.requests, consts_1.REQUEST_STATUS.QUEUED, metaLocal.data.reference);
                }
            }
            // Analyse the trail to determine which models are now stoped
            if (!flow) {
                return;
            }
            ;
            const outputModels = _1.Model.flatten(flow?.output);
            for (const model of outputModels) {
                const ingestModel = ingest.models[model.name];
                if (ingestModel) {
                    const entities = trail_data_model_1.default.getItemsList(ingestModel);
                    const entitiesByParentHash = trail_data_model_1.default.groupByParentHash(ingestModel, entities);
                    for (const parentRefHash of entitiesByParentHash.keys()) {
                        const entitiesOrganised = await connectedModel.organizeList(model, entitiesByParentHash.get(parentRefHash));
                        const listIsComplete = await connectedModel.isListComplete(model, entitiesOrganised.valid);
                        // console.log({ model: model.name, stop})
                        if (listIsComplete) {
                            stopedReferencesHashes.add(parentRefHash);
                            // console.log(parentRefHash, entitiesByParentHash.get(parentRefHash))
                        }
                    }
                }
            }
            // REQUESTS ------------------------------------------------------
            // INGESTED Stage
            const newlyCreatedRequests = trail_data_requests_1.default.getItemsListByStatus(ingest.requests, 'CREATED');
            for (const newRequest of newlyCreatedRequests) {
                // TODO: Add filtering here
                // ...
                const metaLocal = _1.RequestMeta.create(newRequest.source);
                const flowLocal = actor.flows?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, metaLocal.data.flowName)];
                const stepIsPartofFlow = !!flowLocal && _1.Flow.has(flowLocal, metaLocal.data.stepName);
                const requestIsLimited = stopedReferencesHashes.has((0, object_hash_1.default)(metaLocal?.data?.reference));
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
                    _1.Trail.promote(trail, newRequest);
                }
                else {
                    trail_data_requests_1.default.setStatus(ingest.requests, consts_1.REQUEST_STATUS.DISCARDED, metaLocal.data.reference);
                }
            }
            ;
            // DIGESTED Stage
            const newRequests = trail_data_requests_1.default.getItemsListByStatus(digest.requests, 'CREATED');
            for (const newRequest of newRequests) {
                const metaLocal = _1.RequestMeta.create(newRequest.source);
                // TODO: Add filtering here
                // Check if need more data or not (to avoid unnecessary requests)
                if (metaLocal.data.reference) {
                    await _1.Queue.add(actor?.queues?.default, metaLocal.request, { type: metaLocal.data.crawlerMode });
                    trail_data_requests_1.default.setStatus(digest.requests, consts_1.REQUEST_STATUS.QUEUED, metaLocal.data.reference);
                }
            }
            ;
            // REQUESTS DONE
            const remainingRequests = trail_data_requests_1.default.getItemsListByStatus(digest.requests, ['CREATED', 'QUEUED', 'STARTED']);
            const trailEnded = remainingRequests.length === 0;
            if (trailEnded) {
                // Run FLOW_ENDED hook
                await _1.Step.run(actor?.hooks?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, 'FLOW_ENDED')], actor, context);
                // MODELS ------------------------------------------------------------
                // INGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const items = trail_data_model_1.default.getItemsListByStatus(ingest.models[modelName], ['CREATED']);
                    const filteredAs = await connectedModel.organizeList(ingest.models[modelName].model, items);
                    for (const validItem of filteredAs.valid) {
                        _1.Trail.promote(trail, validItem);
                    }
                    ;
                    for (const invalidItem of filteredAs.invalid) {
                        trail_data_model_1.default.setStatus(ingest.models[modelName], consts_1.MODEL_STATUS.DISCARDED, invalidItem.reference);
                    }
                }
                // DIGESTED Stage
                for (const modelName of Object.keys(actor?.models)) {
                    const newItems = trail_data_model_1.default.getItemsListByStatus(digest.models[modelName], ['CREATED']);
                    for (const newItem of newItems) {
                        trail_data_model_1.default.setStatus(digest.models[modelName], consts_1.MODEL_STATUS.PUSHED, newItem.reference);
                    }
                }
                ;
                // Resolve models
                const results = _1.Trail.resolve(trail, flow?.output);
                const resultsAsArray = Array.isArray(results) ? results : [results];
                for (const result of resultsAsArray) {
                    const { valid: isValid, errors } = _1.Model.validate(flow.output, result);
                    // console.log({ result, isValid, errors });
                    if (isValid) {
                        await _1.Dataset.push(actor?.datasets?.default, result);
                    }
                    else {
                        _1.DataStore.setAndGetKey(actor?.stores?.incorrectDataset, { result, errors });
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
//# sourceMappingURL=orchestrator.js.map