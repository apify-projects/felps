import Logger from '@usefelps/logger';
import Transport from 'winston-transport';

describe('Logger', () => {
    let value = false;

    class CustomTransport extends Transport {
        override log(info, callback) {
            value = true;
            callback();
        }
    };

    const logger = Logger.create({ id: '123' }, { transports: [new CustomTransport()] });
    Logger.info(logger, 'Any message', { top: true });

    it('should fire a log to a custom transport', async () => {
        expect(value).toBeTruthy();
    });
});
