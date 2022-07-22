/* eslint-disable @typescript-eslint/no-explicit-any */
import { customAlphabet } from 'nanoid';
import safeStringify from 'fast-safe-stringify';
import cloneDeep from 'lodash.clonedeep';
import pickLodash from 'lodash.pick';
import getByPath from 'lodash.get';
import hasByPath from 'lodash.has';
import setByPath from 'lodash.set';
import unsetByPath from 'lodash.unset';
import isMatchLodash from 'lodash.ismatch';
import { URL } from 'node:url';
import { UID_KEY_PREFIX, UID_KEY_LENGTH } from '@usefelps/constants';
import { ReallyAny } from '@usefelps/types';
import hashMethod from 'object-hash';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

function _merge(source: any, target: any) {
    for (const [key, val] of Object.entries(source)) {
        if (val !== null && typeof val === `object` && ['Array', 'Object'].includes(val?.constructor?.name)) {
            if (target[key] === undefined) {
                target[key] = new (val as any).__proto__.constructor();
            }

            _merge(val, target[key]);
        } else {
            target[key] = val;
        }
    }
    return target; // we're replacing in-situ, so this is more for chaining than anything else
}

export const merge = (...args: any[]): any => {
    const merged = args.slice(1).reduce((merged, obj) => _merge(obj, merged), args[0]);
    // console.log(`merge`, args, merged);
    return merged;
};
export const hash = hashMethod;
export const clone = cloneDeep;
export const get = getByPath;
export const has = hasByPath;
export const set = setByPath;
export const unset = unsetByPath;
export const isMatch = isMatchLodash;
export const pick = pickLodash;
export const stringify = safeStringify;

export const deduplicateFunctions = (functions: Function[]) => {
    const index = new Map();
    for (const fn of functions) index.set(fn.name || fn.toString(), fn);
    return [...index.values()];
}

export const craftUID = customAlphabet(alphabet, 4);
// eslint-disable-next-line max-len
export const craftUIDKey = (prefix?: string, uidLength = UID_KEY_LENGTH) => `${prefix || UID_KEY_PREFIX}_${customAlphabet(alphabet, uidLength)()}${new Date().getTime().toString(36)}`;
export const getUIDKeyTime = (key: string) => parseInt(key.split('_').reverse()[0].slice(UID_KEY_LENGTH), 36);
export const compareUIDKeysFromFirst = (a: string, b: string) => getUIDKeyTime(a) - getUIDKeyTime(b);
export const compareUIDKeysFromLast = (a: string, b: string) => getUIDKeyTime(b) - getUIDKeyTime(a);

export const arrayToKeyedObject = (arr: any[], key?: string) => arr
    .reduce((acc, item) => {
        acc[acc[key] || craftUIDKey()] = item;
        return acc;
    }, {});

export const keyedObjectToArray = (keyedObject: Record<string, any>) => Object.values(keyedObject)
    .reduce((acc, item) => {
        acc.push(item);
        return acc;
    }, []);

export const extendRequest = (request: any, userData: any) => {
    return {
        ...(request || {}),
        userData: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((request as any)?.userData || {}),
            ...(userData || {}),
        },
    };
};

export const randomNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const resolveUrl = (relativeUrl: string, baseUrl: string): string | undefined => {
    if (relativeUrl === undefined) return undefined;
    try {
        const link = new URL(relativeUrl, baseUrl);
        return link.href;
    } catch (error) {
        return undefined;
        // fail silently, return undefined
    }
};

export const pathify = (...args: string[]) => args.filter(Boolean).join('.');

export const intersect = (arrayA: string[], arrayB: string[]) => arrayA.filter((item) => arrayB.includes(item));

export const difference = (arrayA: string[], arrayB: string[]) => arrayA.filter((item) => !arrayB.includes(item));

export const isNumberPredicate = (nb: number | string) => !Number.isNaN(+(typeof nb === 'string' ? parseFloat(nb) : nb));

export const toNumber = (value: ReallyAny) => isNumberPredicate(value) ? +(typeof value === 'string' ? parseFloat(value) : value) : undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const concatAsUniqueArray = (...arrs: any[]) => [...new Set([].concat(...arrs.filter((item) => Array.isArray(item))))];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const orderByClosestLength = (text: string, list: any[], matcher: (item: any) => string = (item) => (item as string)) => {
    const { length } = text;
    const distances = new Map<number, string[]>();
    for (const item of list) {
        const distance = Math.abs(length - matcher(item).length);
        if (distances.get(distance)) {
            distances.set(distance, [...distances.get(distance) as string[], item]);
        } else {
            distances.set(distance, [item]);
        }
    }
    const orderedDistances = Array.from(distances.keys()).sort((a, b) => +a - +b);
    const orderedItems = orderedDistances.reduce((acc, distance) => {
        acc.push(...distances.get(distance) as string[]);
        return acc;
    }, [] as string[]);
    return orderedItems;
};

export const traverse = (obj: any, handler: (key: string, value: any) => void) => {
    for (const k of Object.keys(obj)) {
        handler(k, obj);

        if (obj.hasOwnProperty(k) && obj[k] && typeof obj[k] === 'object') {
            traverse(obj[k], handler);
        } else {
            // Do something with obj[k]
        }
    }
};

export const traverseAndCarry = (
    obj: ReallyAny,
    context: ReallyAny,
    handler: (value: any, key: string | undefined, ctx: ReallyAny) => ReallyAny,
    key?: string,
) => {
    context = handler(obj, key, cloneDeep(context)) || context;

    for (const k of Object.keys(obj)) {
        if (obj.hasOwnProperty(k) && obj[k] && typeof obj[k] === 'object') {
            traverseAndCarry(obj[k], cloneDeep(context), handler, k);
        } else {
            // Do something with obj[k]
        }
    }
};

export const someAsync = async (arr: any[], predicate: (item: any) => Promise<boolean>) => {
    for (const e of arr) {
        if (await predicate(e)) return true;
    }
    return false;
};

export const everyAsync = async (arr: any[], predicate: (item: any) => Promise<boolean>) => {
    for (const e of arr) {
        if (!await predicate(e)) return false;
    }
    return true;
};
