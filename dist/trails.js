"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = exports.getItemsList = exports.create = void 0;
const _1 = require(".");
const consts_1 = require("./consts");
const create = (options) => {
    const { actor } = options;
    const store = actor?.stores?.trails;
    return {
        ..._1.Base.create({ key: 'trails', name: 'trails' }),
        actor,
        store,
    };
};
exports.create = create;
const getItemsList = (trails) => {
    const state = _1.DataStore.get(trails.store);
    const keys = Object.keys(state);
    return keys
        .filter((key) => key.startsWith(consts_1.TRAIL_UID_PREFIX))
        .map((key) => {
        return _1.Trail.create({ id: key, actor: trails.actor });
    });
};
exports.getItemsList = getItemsList;
const getItems = (trails) => {
    return (0, exports.getItemsList)(trails).reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
};
exports.getItems = getItems;
exports.default = { create: exports.create, getItems: exports.getItems, getItemsList: exports.getItemsList };
//# sourceMappingURL=trails.js.map