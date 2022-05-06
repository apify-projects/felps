import Apify from 'apify';
import throttle from 'lodash.throttle';

/**
 * This is far from perfect.
 */

const throttleListener = (handler: () => void): () => void => {
    // Throttle the handler to avoid calling it too often.
    // Not sure if async really works there, TBC.
    return throttle(handler, 5000, { trailing: false });
};

export const onMigrating = (handler: () => void): void => {
    Apify.events.on('migrating', throttleListener(handler));
};

export const onAborting = (handler: () => void): void => {
    Apify.events.on('aborting', throttleListener(handler));
};

export const onPersistState = (handler: () => void): void => {
    Apify.events.on('persistState', ({ isMigrating }) => {
        if (!isMigrating) throttleListener(handler);
    });
};

export const onShutdown = (handler: () => void): void => {
    onMigrating(handler);
    onAborting(handler);
};

export const onIntervals = (handler: () => void): void => {
    onPersistState(handler);
};

export const onAll = (handler: () => void): void => {
    onShutdown(handler);
    onIntervals(handler);
};

export default { onMigrating, onAborting, onPersistState, onShutdown, onIntervals, onAll };
