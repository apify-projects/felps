import { EventsInstance, EventsOptions, ReallyAny } from '@usefelps/types';
export declare const create: (options: EventsOptions) => EventsInstance;
export declare const emit: (events: EventsInstance, eventName: string, ...args: ReallyAny[]) => void;
export declare const on: (events: EventsInstance, eventName: string, callback: (...args: ReallyAny[]) => void) => void;
export declare const once: (events: EventsInstance, eventName: string, callback: (...args: ReallyAny[]) => void) => void;
export declare const batch: (events: EventsInstance, eventName: string, callback: (events: ReallyAny[]) => void, options?: {
    size: number;
}) => void;
export declare const close: (events: EventsInstance) => Promise<void>;
declare const _default: {
    create: (options: EventsOptions) => EventsInstance;
    emit: (events: EventsInstance, eventName: string, ...args: any[]) => void;
    on: (events: EventsInstance, eventName: string, callback: (...args: any[]) => void) => void;
    once: (events: EventsInstance, eventName: string, callback: (...args: any[]) => void) => void;
    batch: (events: EventsInstance, eventName: string, callback: (events: any[]) => void, options?: {
        size: number;
    }) => void;
    close: (events: EventsInstance) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map