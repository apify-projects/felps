import Apify from 'apify';
import EventEmitter from 'events';

const loggerEvents = new EventEmitter();
loggerEvents.setMaxListeners(8000);

export default class Logger {
    resource: { id: string };
    suffix: string;
    level: string;
    logger: typeof Apify.utils.log

    constructor(resource: { id: string }) {
        this.resource = resource;
        this.logger = Apify.utils.log;
        this.logger.setLevel(this.logger.LEVELS.INFO);
        loggerEvents.on('debugMode', () => { this.logger.setLevel(this.logger.LEVELS.DEBUG); });
        loggerEvents.on('infoMode', () => { this.logger.setLevel(this.logger.LEVELS.INFO); });
    }

    debugMode() {
        loggerEvents.emit('debugMode');
    }

    infoMode() {
        loggerEvents.emit('infoMode');
    }

    resourceId() {
        return this.resource.id;
    }

    makeLogMessage(icon: string, id: string, message: string) {
        return `${icon} (${id}${this.suffix ? `:${this.suffix}` : ''})  ${message}`;
    };

    cloneWithSuffix(suffix: string) {
        const logger = new Logger({ id: this.resource.id });
        logger.resource = this.resource;
        logger.suffix = suffix;
        return logger;
    }

    debug(message: string, data?: Record<string, any>) {
        this.logger.debug(this.makeLogMessage('[?!]', this.resourceId(), message), data);
    }

    start(message: string, data?: Record<string, any>) {
        this.logger.info(this.makeLogMessage('[>]', this.resourceId(), message), data);
    }

    end(message: string, data?: Record<string, any>) {
        this.logger.info(this.makeLogMessage('[<]', this.resourceId(), message), data);
    }

    info(message: string, data?: Record<string, any>) {
        this.logger.info(this.makeLogMessage('[i]', this.resourceId(), message), data);
    }

    db(message: string, data?: Record<string, any>) {
        this.logger.info(this.makeLogMessage('[db]', this.resourceId(), message), data);
    }

    warning(message: string, data?: Record<string, any>) {
        this.logger.error(this.makeLogMessage('[?]', this.resourceId(), message), data);
    }

    error(message: string, data?: Record<string, any>) {
        this.logger.error(this.makeLogMessage('[!]', this.resourceId(), message), data);
    }
};
