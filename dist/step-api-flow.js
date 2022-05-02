"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const base_1 = tslib_1.__importDefault(require("./base"));
const consts_1 = require("./consts");
const trail_data_requests_1 = tslib_1.__importDefault(require("./trail-data-requests"));
const create = (actor) => {
    return {
        ...base_1.default.create({ key: 'step-api-flows', name: 'step-api-flows' }),
        handler(context) {
            const currentMeta = _1.RequestMeta.create(context);
            const currentTrail = _1.Trail.createFrom(context?.request, { actor });
            const ingest = _1.Trail.ingested(currentTrail);
            return {
                isStep(stepName) {
                    return currentMeta.data.stepName === stepName;
                },
                isFlow(flowName) {
                    return currentMeta.data.flowName === flowName;
                },
                asFlowName(flowName) {
                    return Object.keys(actor.flows).includes(flowName) ? flowName : undefined;
                },
                asStepName(stepName) {
                    return Object.keys(actor.steps).includes(stepName) ? stepName : undefined;
                },
                start(flowName, request, input, options) {
                    const { useNewTrail = true } = options || {};
                    let { crawlerMode, reference } = options || {};
                    const localTrail = useNewTrail ? _1.Trail.create({ actor }) : currentTrail;
                    const flow = actor.flows?.[flowName];
                    const stepName = flow?.steps?.[0];
                    const step = actor.steps?.[stepName];
                    _1.Model.validate(flow.input, input, { throwError: true });
                    crawlerMode = crawlerMode || step?.crawlerMode || flow?.crawlerMode || actor?.crawlerMode;
                    reference = {
                        ...(reference || {}),
                        [consts_1.TRAIL_KEY_PROP]: localTrail.id,
                    };
                    const flowKey = _1.Trail.setFlow(localTrail, {
                        name: flowName,
                        input,
                        reference,
                        crawlerMode,
                        output: undefined,
                    });
                    const meta = _1.RequestMeta.extend(_1.RequestMeta.create(request), currentMeta.data, {
                        flowName,
                        stepName,
                        crawlerMode,
                        reference: {
                            ...reference,
                            [consts_1.FLOW_KEY_PROP]: flowKey,
                        },
                    });
                    trail_data_requests_1.default.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
                pipe(flowName, request, input, options) {
                    const { crawlerMode, reference } = options || {};
                    return this.start(flowName, request, input, { crawlerMode, reference, useNewTrail: true });
                },
                next(stepName, request, reference, options) {
                    const { crawlerMode } = options || {};
                    const step = actor.steps?.[stepName];
                    const meta = _1.RequestMeta.extend(_1.RequestMeta.create(request), currentMeta.data, {
                        stepName,
                        crawlerMode: crawlerMode || step?.crawlerMode || actor?.crawlerMode,
                        reference: {
                            ...(reference || {}),
                            [consts_1.TRAIL_KEY_PROP]: currentTrail.id,
                        },
                    });
                    trail_data_requests_1.default.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
                stop() {
                    // stop current flow
                },
                retry() {
                    // retry current flow
                },
            };
        },
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=step-api-flow.js.map