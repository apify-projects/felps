/// <reference types="lodash" />
import safeStringify from 'fast-safe-stringify';
import { ReallyAny } from '@usefelps/types';
export declare const merge: any;
export declare const hash: any;
export declare const clone: <T>(value: T) => T;
export declare const get: {
    <TObject extends object, TKey extends keyof TObject>(object: TObject, path: TKey | [TKey]): TObject[TKey];
    <TObject_1 extends object, TKey_1 extends keyof TObject_1>(object: TObject_1, path: TKey_1 | [TKey_1]): TObject_1[TKey_1];
    <TObject_2 extends object, TKey_2 extends keyof TObject_2, TDefault>(object: TObject_2, path: TKey_2 | [TKey_2], defaultValue: TDefault): TDefault | Exclude<TObject_2[TKey_2], undefined>;
    <TObject_3 extends object, TKey1 extends keyof TObject_3, TKey2 extends keyof TObject_3[TKey1]>(object: TObject_3, path: [TKey1, TKey2]): TObject_3[TKey1][TKey2];
    <TObject_4 extends object, TKey1_1 extends keyof TObject_4, TKey2_1 extends keyof TObject_4[TKey1_1]>(object: TObject_4, path: [TKey1_1, TKey2_1]): TObject_4[TKey1_1][TKey2_1];
    <TObject_5 extends object, TKey1_2 extends keyof TObject_5, TKey2_2 extends keyof TObject_5[TKey1_2], TDefault_1>(object: TObject_5, path: [TKey1_2, TKey2_2], defaultValue: TDefault_1): TDefault_1 | Exclude<TObject_5[TKey1_2][TKey2_2], undefined>;
    <TObject_6 extends object, TKey1_3 extends keyof TObject_6, TKey2_3 extends keyof TObject_6[TKey1_3], TKey3 extends keyof TObject_6[TKey1_3][TKey2_3]>(object: TObject_6, path: [TKey1_3, TKey2_3, TKey3]): TObject_6[TKey1_3][TKey2_3][TKey3];
    <TObject_7 extends object, TKey1_4 extends keyof TObject_7, TKey2_4 extends keyof TObject_7[TKey1_4], TKey3_1 extends keyof TObject_7[TKey1_4][TKey2_4]>(object: TObject_7, path: [TKey1_4, TKey2_4, TKey3_1]): TObject_7[TKey1_4][TKey2_4][TKey3_1];
    <TObject_8 extends object, TKey1_5 extends keyof TObject_8, TKey2_5 extends keyof TObject_8[TKey1_5], TKey3_2 extends keyof TObject_8[TKey1_5][TKey2_5], TDefault_2>(object: TObject_8, path: [TKey1_5, TKey2_5, TKey3_2], defaultValue: TDefault_2): TDefault_2 | Exclude<TObject_8[TKey1_5][TKey2_5][TKey3_2], undefined>;
    <TObject_9 extends object, TKey1_6 extends keyof TObject_9, TKey2_6 extends keyof TObject_9[TKey1_6], TKey3_3 extends keyof TObject_9[TKey1_6][TKey2_6], TKey4 extends keyof TObject_9[TKey1_6][TKey2_6][TKey3_3]>(object: TObject_9, path: [TKey1_6, TKey2_6, TKey3_3, TKey4]): TObject_9[TKey1_6][TKey2_6][TKey3_3][TKey4];
    <TObject_10 extends object, TKey1_7 extends keyof TObject_10, TKey2_7 extends keyof TObject_10[TKey1_7], TKey3_4 extends keyof TObject_10[TKey1_7][TKey2_7], TKey4_1 extends keyof TObject_10[TKey1_7][TKey2_7][TKey3_4]>(object: TObject_10, path: [TKey1_7, TKey2_7, TKey3_4, TKey4_1]): TObject_10[TKey1_7][TKey2_7][TKey3_4][TKey4_1];
    <TObject_11 extends object, TKey1_8 extends keyof TObject_11, TKey2_8 extends keyof TObject_11[TKey1_8], TKey3_5 extends keyof TObject_11[TKey1_8][TKey2_8], TKey4_2 extends keyof TObject_11[TKey1_8][TKey2_8][TKey3_5], TDefault_3>(object: TObject_11, path: [TKey1_8, TKey2_8, TKey3_5, TKey4_2], defaultValue: TDefault_3): TDefault_3 | Exclude<TObject_11[TKey1_8][TKey2_8][TKey3_5][TKey4_2], undefined>;
    <T>(object: import("lodash").NumericDictionary<T>, path: number): T;
    <T_1>(object: import("lodash").NumericDictionary<T_1>, path: number): T_1;
    <T_2, TDefault_4>(object: import("lodash").NumericDictionary<T_2>, path: number, defaultValue: TDefault_4): T_2 | TDefault_4;
    <TDefault_5>(object: null, path: import("lodash").PropertyPath, defaultValue: TDefault_5): TDefault_5;
    (object: null, path: import("lodash").PropertyPath): undefined;
    (object: any, path: import("lodash").PropertyPath, defaultValue?: any): any;
};
export declare const has: <T>(object: T, path: import("lodash").PropertyPath) => boolean;
export declare const set: {
    <T extends object>(object: T, path: import("lodash").PropertyPath, value: any): T;
    <TResult>(object: object, path: import("lodash").PropertyPath, value: any): TResult;
};
export declare const unset: (object: any, path: import("lodash").PropertyPath) => boolean;
export declare const isMatch: (object: object, source: object) => boolean;
export declare const pick: {
    <T extends object, U extends keyof T>(object: T, ...props: import("lodash").Many<U>[]): Pick<T, U>;
    <T_1>(object: T_1, ...props: import("lodash").PropertyPath[]): Partial<T_1>;
};
export declare const stringify: typeof safeStringify;
export declare const craftUID: (size?: number) => string;
export declare const craftUIDKey: (prefix?: string, uidLength?: number) => string;
export declare const getUIDKeyTime: (key: string) => number;
export declare const compareUIDKeysFromFirst: (a: string, b: string) => number;
export declare const compareUIDKeysFromLast: (a: string, b: string) => number;
export declare const arrayToKeyedObject: (arr: any[]) => any;
export declare const keyedObjectToArray: (keyedObject: Record<string, any>) => any;
export declare const extendRequest: (request: any, userData: any) => any;
export declare const randomNumberBetween: (min: number, max: number) => number;
export declare const resolveUrl: (absoluteUrl: string, relativeUrl: string) => string | undefined;
export declare const pathify: (...args: string[]) => string;
export declare const intersect: (arrayA: string[], arrayB: string[]) => string[];
export declare const difference: (arrayA: string[], arrayB: string[]) => string[];
export declare const isNumberPredicate: (nb: number) => boolean;
export declare const concatAsUniqueArray: (...arrs: any[]) => any[];
export declare const orderByClosestLength: (text: string, list: any[], matcher?: (item: any) => string) => string[];
export declare const traverse: (obj: any, handler: (key: string, value: any) => void) => void;
export declare const traverseAndCarry: (obj: ReallyAny, context: ReallyAny, handler: (value: any, key: string | undefined, ctx: ReallyAny) => ReallyAny, key?: string) => void;
export declare const someAsync: (arr: any[], predicate: (item: any) => Promise<boolean>) => Promise<boolean>;
export declare const everyAsync: (arr: any[], predicate: (item: any) => Promise<boolean>) => Promise<boolean>;
//# sourceMappingURL=index.d.ts.map