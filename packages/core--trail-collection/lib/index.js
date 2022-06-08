"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = exports.getItemsList = exports.create = void 0;
const tslib_1 = require("tslib");
const CONST = tslib_1.__importStar(require("@usefelps/core--constants"));
const core__instance_base_1 = tslib_1.__importDefault(require("@usefelps/core--instance-base"));
const core__store__data_1 = tslib_1.__importDefault(require("@usefelps/core--store--data"));
const core__trail_1 = tslib_1.__importDefault(require("@usefelps/core--trail"));
const create = (options) => {
    const { actor } = options;
    const store = actor?.stores?.trails;
    return {
        ...core__instance_base_1.default.create({ key: 'trails', name: 'trails' }),
        actor,
        store,
    };
};
exports.create = create;
const getItemsList = (trails) => {
    const state = core__store__data_1.default.get(trails.store);
    const keys = Object.keys(state);
    return keys
        .filter((key) => key.startsWith(CONST.TRAIL_UID_PREFIX))
        .map((key) => {
        return core__trail_1.default.create({ id: key, actor: trails.actor });
    });
};
exports.getItemsList = getItemsList;
const getItems = (trails) => {
    return (0, exports.getItemsList)(trails).reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
};
exports.getItems = getItems;
exports.default = { create: exports.create, getItems: exports.getItems, getItemsList: exports.getItemsList };
//# sourceMappingURL=index.js.map