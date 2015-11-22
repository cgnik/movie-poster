/**
 * Logger levels for the Movie retriever classes.
 * @type {{error: number, info: number, debug: number, always: number}}
 */

LogLevels = {
    'error': 1,
    'info': 2,
    'debug': 3,
    'always': 4
};

/**
 * Logger class constructor
 * @constructor
 */
function Log() {
    this.levels = LogLevels;
    this.level = LogLevels.error;
    this.target = console.log;
};

Log.prototype.setLevel = function (level) {
    this.level = level;
};

Log.prototype.shouldLog = function (lev) {
    return this.level >= lev || (this.level == this.levels.always || lev == this.levels.always);
};

Log.prototype.log = function (message, level) {
    if (this.shouldLog(level)) {
        console.log(message);
        this.target(message + "\n");
    }
};

Log.prototype.debug = function (message) {
    this.log(message, this.levels.debug)
};

Log.prototype.info = function (message) {
    this.log(message, this.levels.info);
};

Log.prototype.error = function (message) {
    this.log(message, this.levels.error);
};

Log.prototype.always = function (message) {
    this.log(message, this.levels.always);
};

Log.prototype.debugObject = function (o) {
    this.log('__DEBUG_OBJECT__' + JSON.stringify(o) + '__DEBUG_OBJECT__', this.levels.always);
}

module.exports = new Log();
