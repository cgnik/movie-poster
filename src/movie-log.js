/**
 * Logger levels for the Movie retriever classes.
 * @type {{error: number, info: number, debug: number, always: number}}
 */

const LogLevels = {
    'error': 1,
    'warn': 2,
    'info': 3,
    'debug': 4,
    'always': 5
};

/**
 * Logger class constructor
 * @constructor
 */
class Log {
    constructor() {
        this.levels = LogLevels;
        this.level = this.levels.warn;
        this.target = console.log;
    }

    setLevel(level) {
        this.level = level;
    }

    shouldLog(lev) {
        return this.level >= lev || (this.level == this.levels.always || lev == this.levels.always);
    }

    log(message, level) {
        if (this.shouldLog(level)) {
            this.target(message);
        }
    }

    debug(message) {
        this.log(message, this.levels.debug)
    }

    info(message) {
        this.log(message, this.levels.info);
    }

    warn(message) {
        this.log(message, this.levels.warn);
    }

    error(message) {
        this.log(message, this.levels.error);
    }

    always(message) {
        this.log(message, this.levels.always);
    }

    debugObject(o) {
        this.log('__DEBUG_OBJECT__' + JSON.stringify(o) + '__DEBUG_OBJECT__', this.levels.debug);
    }
}
module.exports = new Log();
