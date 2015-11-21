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
};

Log.prototype.setLevel = function (level) {
    this.level = level;
};

Log.prototype.shouldLog = function (lev) {
    return this.level >= lev || (this.level == this.levels.always || lev == this.levels.always);
};

Log.prototype.log = function (message, level) {
    if (this.shouldLog(level)) {
        this.target(message);
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

Log.prototype.target = console.log;

//process.argv.forEach(function (val, indexer, array) {
//    if (val == '--debug') {
//        console.log('Debug logging enabled');
//        exports.level = 'debug';
//    } else if (val == '--error') {
//        console.log('Error logging enabled');
//        exports.level = 'error';
//    } else if (val == '--info') {
//        console.log('Info logging enabled');
//        exports.level = 'info';
//    }
//});

module.exports = new Log();
