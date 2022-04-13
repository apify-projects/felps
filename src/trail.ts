import Base from './base';
import { REFERENCE_KEY } from './common/consts';
import {
    DeepPartial, GenerateObject, References,
    TrailInOutMethods, TrailInOutMethodsOptions, TrailOptions,
    TrailState, TrailStateInOutNames,
} from './common/types';
import { concatAsUniqueArray, craftUIDKey, pathify } from './common/utils';
import DataStore from './data-store';
import Model from './model';

export default class Trail<ModelDefinitions> extends Base {
    private _id: string;
    private _store: DataStore;
    private _models: Record<string, Model>;

    constructor(options: TrailOptions) {
        const { id = craftUIDKey('trail'), store, models = {} } = options || {};
        super({ key: 'store-trail', name: id });

        this._id = id;
        this._store = store;
        this._models = models;

        this.init();
    }

    init() {
        if (!this._store.has(this._id)) {
            const initialState: DeepPartial<TrailState> = {
                id: this._id,
                query: {},
                requests: {},
                stats: { startedAt: new Date().toISOString() },
            };

            this._store.set(this._id, initialState);
        }
    }

    get ingested(): GenerateObject<keyof ModelDefinitions, TrailInOutMethods> {
        return Object.keys(this._models).reduce((acc, modelName) => {
            acc[modelName] = makeMethods({ name: modelName, path: 'ingested', store: this._store });
            return acc;
        }, {} as GenerateObject<keyof ModelDefinitions, TrailInOutMethods>);
    }

    get digested(): GenerateObject<keyof ModelDefinitions, TrailInOutMethods> {
        return Object.keys(this._models).reduce((acc, modelName) => {
            acc[modelName] = makeMethods({ name: modelName, path: 'digested', store: this._store });
            return acc;
        }, {} as GenerateObject<keyof ModelDefinitions, TrailInOutMethods>);
    }
}

type ModelPathsOptions = {
    name: string;
    path: TrailStateInOutNames;
}

type ModelPathsMethods<ReferenceType> = {
    ITEMS: (reference: Partial<ReferenceType>) => string;
    ITEM_REQUEST: (reference: Partial<ReferenceType>) => string;
    ITEM_DATA: (reference: Partial<ReferenceType>) => string;
    ITEM_REFERENCES: (reference: Partial<ReferenceType>) => string;
    LISTING_REQUEST: (reference: Partial<ReferenceType>) => string;
}

const getModelPaths = <ReferenceType = unknown>(options: ModelPathsOptions): ModelPathsMethods<ReferenceType> => {
    const { name, path } = options;

    const basePath = pathify(path, name);
    const referenceKey = REFERENCE_KEY(name);

    return {
        ITEMS: (reference) => pathify(basePath, 'items', reference?.[referenceKey]),
        ITEM_REQUEST: (reference) => pathify(basePath, 'items', reference?.[referenceKey], 'request'),
        ITEM_DATA: (reference) => pathify(basePath, 'items', reference?.[referenceKey], 'data'),
        ITEM_REFERENCES: (reference) => pathify(basePath, 'itemes', reference?.[referenceKey], 'references'),
        LISTING_REQUEST: (reference) => pathify(basePath, 'listingRequests', reference?.[referenceKey]),
    };
};

const makeMethods = (options: TrailInOutMethodsOptions): TrailInOutMethods => {
    const { name, path, store } = options;
    const referenceKey = REFERENCE_KEY(name);
    const paths = getModelPaths({ name, path });

    let updateMerger = (existingValue, newValue) => {
        if (!newValue && typeof existingValue !== 'number') return existingValue;
        if (Array.isArray(newValue)) {
            return concatAsUniqueArray(existingValue, newValue);
        }
        return undefined;
    };

    return {
        // paths
        getPath: (ref) => paths.ITEMS(ref),
        getReferencesPath: (ref) => paths.ITEM_REFERENCES(ref),
        getRequestPath: (ref) => paths.ITEM_REQUEST(ref),
        getListingRequestPath: (ref) => paths.LISTING_REQUEST(ref),
        // items
        get(ref) {
            return store.get(this.getPath(ref));
        },
        getReferences(ref) {
            return store.get(this.getReferencesPath(ref));
        },
        getItemsAsObject() {
            return store.get(this.getPath());
        },
        getItems() {
            return Object.values(this.getItemsAsObject());
        },
        set(partialData, ref) {
            // const { identifiers = [] } = ref || {} as any;
            // const newIdentifiers = concatAsUniqueArray(identifiers, getIdentifiersFromItem(partialData || {}));

            // const keyValues = getItemKeyValues(partialData || {});
            // const existingItems = this.getItemsAsObject(ref);
            // const existingItemReferences = this.getItemReferencesAsObject(ref);

            // const findExistingReference = () => {
            //     if (!Object.keys(keyValues).length) return {};

            //     for (const key of Object.keys(existingItems)) {
            //         const existingItem = existingItems[key];
            //         const existingReference = existingItemReferences[key];
            //         const existingIdentifiers = concatAsUniqueArray(existingReference?.identifiers, getIdentifiersFromItem(existingItem));

            //         const keyValuesMatches = Object.keys(keyValues).every((k) => existingItem[k] === keyValues[k]);
            //         if (keyValuesMatches) {
            //             const identifiersPartialMatches = newIdentifiers.some((identifier: string) => existingIdentifiers.includes(identifier));
            //             if (!newIdentifiers.length || identifiersPartialMatches) {
            //                 return {
            //                     ...existingReference[key],
            //                     identifiers: concatAsUniqueArray(existingIdentifiers, newIdentifiers),
            //                     [referenceKey]: key,
            //                 };
            //             }
            //         }
            //     }

            //     return {};
            // };

            // const foundExistingReference = findExistingReference();

            const reference = {
                // Sets a crafted reference
                [referenceKey]: craftUIDKey(),
                // Overrides it with the passed reference (when it exists)
                ...(ref || {}),
                // Overrides it by an existing reference (when it exists)
                // ...foundExistingReference,
            } as References;

            return this.update(partialData || {}, reference);
        },
        update(partialData, ref) {
            store.update(this.getPath(ref), partialData || {}, updateMerger);
            const referencePath = this.getReferencesPath(ref);
            if (referencePath) {
                store.update(referencePath, ref, updateMerger);
            }
            return ref;
        },
        // request
        getRequest(ref) {
            return store.get(this.getRequestPath(ref));
        },
        setRequest(request, partialData, ref) {
            const setRef = this.set(partialData, ref);
            const reference = { ...setRef, ...(ref || {}) };
            store.update(this.getRequestPath(reference), request || {});
            return reference;
        },
        getRequestItemsAsObject() {
            return store.get(this.getRequestPath()) || {};
        },
        getRequestItems() {
            return Object.values(this.getRequestItemsAsObject());
        },
        // Listing Requests
        setListingRequest(request, ref) {
            const requestKey = craftUIDKey();
            const reference = { requestKey, ...(ref || {}) };
            store.update(this.getListingRequestPath(reference), request || {});
            return reference;
        },
        getListingRequest(ref) {
            return store.get(this.getListingRequestPath(ref));
        },
        getListingRequestItemsAsObject(ref) {
            return store.get(this.getListingRequestPath(ref)) || {};
        },
        getListingRequestItems(ref) {
            return Object.values(this.getListingRequestItemsAsObject(ref));
        },
        // general
        count(ref) {
            return Object.keys(this.get(ref)).length;
        },
        availableCount(ref) {
            return Infinity;
            // return getMaxItems() - this.count(ref);
        },
        acceptsMore(keys, ref) {
            return this.availableCount(ref) > 0 || (keys || []).some((key) => Object.keys(this.get(ref)).includes(key));
        },
        getNextKeys(keyedResults, ref) {
            // const sortedKeys = sortBy(keyedResults, getSortingOrder());

            // const existingKeys = (sortedKeys || []).filter((key) => Object.keys(this.getAllAsObject(ref)).includes(key));
            // const newKeys = (sortedKeys || []).filter((key) => !Object.keys(this.getAllAsObject(ref)).includes(key));

            // // TODO: Doesnt make sense for requests
            // // const newValidKeys = newKeys.filter((key) => validateItem(keyedResults[key]));
            // // console.dir({ newKeys, newValidKeys }, { depth: null });

            // const existingExistingKeysCount = this.count(ref) - existingKeys.length;
            // const maxNbKeys = getMaxItems() - existingExistingKeysCount;
            // const acceptedKeys = [...existingKeys, ...newKeys].slice(0, maxNbKeys > 0 ? maxNbKeys : 0);

            // return acceptedKeys;
            return [];
        },
    };
};
