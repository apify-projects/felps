import EventEmitter from 'eventemitter3';

import throttle from 'lodash.throttle';
import Queue from 'queue';
import { Base } from '.';
import ApifyEvents from './apify-events';
import { EventsInstance, EventsOptions, ReallyAny } from './types';

export const create = (options: EventsOptions): EventsInstance => {
    return {
        ...Base.create({ key: 'events', name: options?.name || 'default' }),
        resource: new EventEmitter(),
        queues: [],
        batchSize: options?.batchSize || 10,
        batchMinIntervals: options?.batchMinIntervals || 5000,
    };
};

export const emit = (events: EventsInstance, eventName: string, ...args: ReallyAny[]) => {
    events.resource.emit(eventName, ...args);
};

export const on = (events: EventsInstance, eventName: string, callback: (...args: ReallyAny[]) => void) => {
    events.resource.on(eventName, callback);
};

export const once = (events: EventsInstance, eventName: string, callback: (...args: ReallyAny[]) => void) => {
    events.resource.once(eventName, callback);
};

export const batch = (events: EventsInstance, eventName: string, callback: (...args: ReallyAny[]) => void, options?: { size: number }) => {
    const { size = events.batchSize } = options || {};
    const stack: ReallyAny[] = [];

    const q = new Queue({ concurrency: 1, autostart: true });
    events.queues.push(q);

    ApifyEvents.onShutdown(async () => {
        await processor(true);
    });

    const processor = async (forceAll = false) => {
        if (forceAll) {
            await Promise.resolve(callback(stack));
            stack.splice(0, stack.length);
        } else if (stack.length >= size) {
            await Promise.resolve(callback(stack.slice(0, size)));
            stack.splice(0, size);
        }
    };

    const enqueue = throttle((...args) => q.push(async () => processor(...args)), events.batchMinIntervals);

    events.resource.on(eventName, (...args) => {
        stack.push(args);
        enqueue();
    });
};

export const close = async (events: EventsInstance) => {
    await Promise.allSettled(
        events.queues.map((q) => new Promise(
            (resolve) => {
                if (!q.length) return resolve(undefined);
                q.on('end', resolve);
            },
        )),
    );
};

export default { create, emit, on, once, batch, close };
