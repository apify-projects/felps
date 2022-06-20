import EventEmitter from 'eventemitter3';
import Queue from 'queue';
import Base from '@usefelps/core--instance-base';
import ApifyEvents from '@usefelps/apify--events';
import { EventsInstance, EventsOptions, ReallyAny } from '@usefelps/types';

export const create = (options: EventsOptions): EventsInstance => {
    return {
        ...Base.create({ key: 'events', name: options?.name || 'default' }),
        resource: options?.resource || new EventEmitter(),
        queues: options?.queues || [],
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

export const batch = (events: EventsInstance, eventName: string, callback: (events: ReallyAny[]) => void, options?: { size: number }) => {
    const { size = events.batchSize } = options || {};
    const stack: ReallyAny[] = [];

    const q = new Queue({ concurrency: 1, autostart: true });
    events.queues.push(q);

    ApifyEvents.onShutdown(async () => {
        await processor(true);
    });

    const processor = async (forceAll = false) => {
        if (forceAll) {
            await Promise.resolve(callback(stack.splice(0, stack.length)));
        } else if (stack.length >= size) {
            await Promise.resolve(callback(stack.splice(0, size)));
        }
    };

    const enqueue = (forceAll = false) => q.push(async () => processor(forceAll));

    events.resource.on(eventName, (event: ReallyAny) => {
        stack.push(event);
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
