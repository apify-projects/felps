"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const merge_deep_1 = tslib_1.__importDefault(require("merge-deep"));
const core__model_1 = tslib_1.__importDefault(require("@usefelps/core--model"));
const core__trail_1 = tslib_1.__importDefault(require("@usefelps/core--trail"));
const core__request_meta_1 = tslib_1.__importDefault(require("@usefelps/core--request-meta"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__constants_1 = require("@usefelps/core--constants");
const core__trail__data_requests_1 = tslib_1.__importDefault(require("@usefelps/core--trail--data-requests"));
const create = (actor) => {
    return {
        ...core__instance_base_1.default.create({ key: 'step-api-flows', name: 'step-api-flows' }),
        handler(context) {
            const currentMeta = core__request_meta_1.default.create(context);
            const currentTrail = core__trail_1.default.createFrom(context?.request, { actor });
            const ingest = core__trail_1.default.ingested(currentTrail);
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
                currentStep: () => (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, currentMeta.data.stepName),
                currentFlow: () => (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, currentMeta.data.flowName),
                isStep(stepNameToTest, stepNameExpected) {
                    actorKeyMustExists();
                    return (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepNameToTest) === (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepNameExpected);
                },
                isSomeStep(stepNameToTest, stepNamesExpected) {
                    actorKeyMustExists();
                    return stepNamesExpected
                        .map((stepNameExpected) => (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepNameExpected))
                        .includes((0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepNameToTest));
                },
                isFlow(flowNameToTest, flowNameExpected) {
                    actorKeyMustExists();
                    return (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowNameToTest) === (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowNameExpected);
                },
                isSomeFlow(flowNameToTest, flowNamesExpected) {
                    actorKeyMustExists();
                    return flowNamesExpected
                        .map((flowNameExpected) => (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowNameExpected))
                        .includes((0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowNameToTest));
                },
                isCurrentActor(actorName) {
                    return actorKey === actorName;
                },
                isCurrentStep(stepName) {
                    return (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, currentMeta.data.stepName) === (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepName);
                },
                isCurrentFlow(flowName) {
                    return (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, currentMeta.data.flowName) === (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowName);
                },
                asFlowName(flowName) {
                    actorKeyMustExists();
                    const prefixedFlowName = (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowName);
                    return Object.keys(actor.flows).includes(prefixedFlowName) ? prefixedFlowName : undefined;
                },
                asStepName(stepName) {
                    actorKeyMustExists();
                    const prefixedStepName = (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepName);
                    return Object.keys(actor.steps).includes(prefixedStepName) ? prefixedStepName : undefined;
                },
                startFlow(flowName, request, input, options) {
                    const { useNewTrail = true } = options || {};
                    let { crawlerOptions, reference } = options || {};
                    actorKeyMustExists();
                    const flowNamePrefixed = (0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, flowName);
                    const localTrail = useNewTrail ? core__trail_1.default.create({ actor }) : currentTrail;
                    const flow = actor.flows?.[flowNamePrefixed];
                    const stepName = flow?.steps?.[0];
                    const step = actor.steps?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepName)];
                    const currentFlow = actor.flows?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, currentMeta.data?.flowName)];
                    if (currentFlow && !(currentFlow.flows || []).includes((0, core__constants_1.UNPREFIXED_NAME_BY_ACTOR)(flowName))) {
                        throw new Error(`Flow ${flowName} is not runnable from current flow ${currentFlow.name}`);
                    }
                    ;
                    const inputCompleted = { ...(input || {}), flow: (0, core__constants_1.UNPREFIXED_NAME_BY_ACTOR)(flowName) };
                    core__model_1.default.validate(flow.input, inputCompleted, { throwError: true });
                    crawlerOptions = (0, merge_deep_1.default)(actor?.crawlerOptions || {}, flow?.crawlerOptions || {}, step?.crawlerOptions || {}, crawlerOptions || {});
                    reference = {
                        ...(currentMeta.data.reference || {}),
                        ...(reference || {}),
                        [core__constants_1.TRAIL_KEY_PROP]: localTrail.id,
                    };
                    const flowKey = core__trail_1.default.setFlow(localTrail, {
                        name: flowNamePrefixed,
                        input: inputCompleted,
                        reference,
                        crawlerOptions,
                        output: undefined,
                    });
                    const meta = core__request_meta_1.default.extend(core__request_meta_1.default.create(request), currentMeta.data, {
                        flowStart: true,
                        flowName: flowNamePrefixed,
                        stepName,
                        crawlerOptions,
                        reference: {
                            ...reference,
                            [core__constants_1.FLOW_KEY_PROP]: flowKey,
                        },
                    });
                    const localIngested = core__trail_1.default.ingested(localTrail);
                    core__trail__data_requests_1.default.set(localIngested.requests, meta.request);
                    return meta.data.reference;
                },
                paginateStep(request, reference, options) {
                    return this.nextStep(this.currentStep(), request, reference, options);
                },
                nextStep(stepName, request, reference, options) {
                    let { crawlerOptions } = options || {};
                    actorKeyMustExists();
                    const flow = actor.flows?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, currentMeta.data.flowName)];
                    const step = actor.steps?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, stepName)];
                    crawlerOptions = (0, merge_deep_1.default)(actor?.crawlerOptions || {}, flow?.crawlerOptions || {}, step?.crawlerOptions || {}, crawlerOptions || {});
                    const meta = core__request_meta_1.default.extend(core__request_meta_1.default.create(request), currentMeta.data, {
                        flowStart: false,
                        stepName,
                        crawlerOptions,
                        reference: {
                            ...(reference || {}),
                            [core__constants_1.TRAIL_KEY_PROP]: currentTrail.id,
                        },
                    });
                    core__trail__data_requests_1.default.set(ingest.requests, meta.request);
                    return meta.data.reference;
                },
                nextDefaultStep(request, reference, options) {
                    actorKeyMustExists();
                    const flow = actor.flows?.[(0, core__constants_1.PREFIXED_NAME_BY_ACTOR)(actorKey, currentMeta.data.flowName)];
                    const currentStepIndex = (flow?.steps || []).findIndex((localStepName) => localStepName
                        === (0, core__constants_1.UNPREFIXED_NAME_BY_ACTOR)(currentMeta.data.stepName));
                    const nextStepName = currentStepIndex > -1 ? flow.steps[currentStepIndex + 1] : undefined;
                    if (!nextStepName) {
                        throw new Error(`No default step found for flow ${flow.name}`);
                    }
                    return this.nextStep(nextStepName, request || { url: context.request.url, headers: context.request.headers }, reference, options);
                },
                stop() {
                    context.request.userData = core__request_meta_1.default.extend(currentMeta, { stepStop: true }).userData;
                },
                retry() {
                    throw new Error('Retry this step');
                },
            };
        },
    };
};
exports.create = create;
exports.default = { create: exports.create };
//# sourceMappingURL=index.js.map