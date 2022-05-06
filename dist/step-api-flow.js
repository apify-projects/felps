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
            const actorKey = currentMeta.data.reference.fActorKey;
            const actorKeyMustExists = () => {
                if (!actorKey)
                    throw new Error('Actor key not found');
            };
            return {
                actor: () => actor,
                steps: () => actor.steps,
                flows: () => actor.flows,
                hooks: () => actor.hooks,
                isStep(stepNameToTest, stepNameExpected) {
                    actorKeyMustExists();
                    return (0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepNameToTest) === (0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepNameExpected);
                },
                isFlow(flowNameToTest, flowNameExpected) {
                    actorKeyMustExists();
                    return (0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowNameToTest) === (0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowNameExpected);
                },
                isCurrentStep(stepName) {
                    return currentMeta.data.stepName === stepName;
                },
                isCurrentFlow(flowName) {
                    return currentMeta.data.flowName === flowName;
                },
                asFlowName(flowName) {
                    actorKeyMustExists();
                    const prefixedFlowName = (0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowName);
                    return Object.keys(actor.flows).includes(prefixedFlowName) ? prefixedFlowName : undefined;
                },
                asStepName(stepName) {
                    actorKeyMustExists();
                    const prefixedStepName = (0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepName);
                    return Object.keys(actor.steps).includes(prefixedStepName) ? prefixedStepName : undefined;
                },
                start(flowName, request, input, options) {
                    let { crawlerMode, reference } = options || {};
                    actorKeyMustExists();
                    const localTrail = _1.Trail.create({ actor });
                    const flow = actor.flows?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowName)];
                    const stepName = flow?.steps?.[0];
                    const step = actor.steps?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepName)];
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
                        flowStart: true,
                        flowName,
                        stepName,
                        crawlerMode,
                        reference: {
                            ...reference,
                            [consts_1.FLOW_KEY_PROP]: flowKey,
                        },
                    });
                    const localIngested = _1.Trail.ingested(localTrail);
                    trail_data_requests_1.default.set(localIngested.requests, meta.request);
                    return meta.data.reference;
                },
                pipe(flowName, request, input, options) {
                    const { crawlerMode, reference } = options || {};
                    return this.start(flowName, request, input, { crawlerMode, reference, useNewTrail: true });
                },
                next(stepName, request, reference, options) {
                    const { crawlerMode } = options || {};
                    actorKeyMustExists();
                    const step = actor.steps?.[(0, consts_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepName)];
                    const meta = _1.RequestMeta.extend(_1.RequestMeta.create(request), currentMeta.data, {
                        flowStart: false,
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
                    context.request.userData = _1.RequestMeta.extend(currentMeta, { stepStop: true }).userData;
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