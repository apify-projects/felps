import { ReallyAny } from '@usefelps/types';

export const onExit = (listener: (evt: ReallyAny) => void | Promise<void>) => {
    let executedOnceOnly = false;

    [
        'beforeExit', 'disconnect', 'exit', 'uncaughtException', 'unhandledRejection',
        'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP',
        'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV',
        'SIGUSR2', 'SIGTERM',
    ].forEach(evt => process.on(evt, (evtOrExitCodeOrError) => {
        if (!executedOnceOnly) {
            executedOnceOnly = true;

            Promise.resolve(listener(evt))
                .catch((e) => {
                    console.error('Caught error on interval listener', e);
                })
                .finally(() => {
                    process.exit(isNaN(+evtOrExitCodeOrError) ? 1 : +evtOrExitCodeOrError);
                });
        }
    }));

};

export const onInterval = (listener: () => void | Promise<void>, interval: number = 30000): NodeJS.Timer => {
    return setInterval(async () => {
        try {
            await Promise.resolve(listener());
        } catch (e) {
            console.error('Caught error on interval listener', e);
        }
    }, interval);
}

export default { onExit, onInterval };
