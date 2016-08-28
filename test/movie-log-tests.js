
describe('Log', function () {
    beforeEach(function () {
        captured = '';
        log = require('../src/movie-log.js');
        log.target = function (blah) {
            captured += blah + '\n';
        };
    });
    describe('#always', function () {
        beforeEach(function () {
            log.level = log.levels.always;
        })
        it('should always log always', function () {
            log.always('duh');
            captured.should.equal('duh\n');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'always') === 'duh\n');
            log.always('duh');
            captured.should.equal('duh\n');
        })
        it('should always log warn', function () {
            log.warn('duh');
            captured.should.equal('duh\n');
        })
        it('should always log info', function () {
            //assert(capture(log, log.info, 'duh', 'always') === 'duh\n');
            log.info('duh');
            captured.should.equal('duh\n');
        })
        it('should always log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'always') === 'duh\n');
            log.debug('duh');
            captured.should.equal('duh\n');
        })
    })
    describe('#error', function () {
        beforeEach(function () {
            log.level = log.levels.error;
        })
        it('should always log always', function () {
            //assert(capture(log, log.always, 'duh', 'error') === 'duh\n');
            log.always('duh');
            captured.should.equal('duh\n');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'error') === 'duh\n');
            log.error('duh');
            captured.should.equal('duh\n');
        })
        it('should never log warn', function () {
            log.warn('duh');
            captured.should.be.empty;
        })
        it('should never log info', function () {
            //assert(capture(log, log.info, 'duh', 'error') === '');
            log.info('duh');
            captured.should.be.empty;
        })
        it('should never log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'error') === '');
            log.debug('duh');
            captured.should.be.empty;
        })
    })
    describe('#warn', function () {
        beforeEach(function () {
            log.level = log.levels.warn;
        })
        it('should always log always', function () {
            //assert(capture(log, log.always, 'duh', 'error') === 'duh\n');
            log.always('duh');
            captured.should.equal('duh\n');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'error') === 'duh\n');
            log.error('duh');
            captured.should.equal('duh\n');
        })
        it('should always log warn', function () {
            log.warn('duh');
            captured.should.equal('duh\n');
        })
        it('should never log info', function () {
            //assert(capture(log, log.info, 'duh', 'error') === '');
            log.info('duh');
            captured.should.be.empty;
        })
        it('should never log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'error') === '');
            log.debug('duh');
            captured.should.be.empty;
        })
    })
    describe('#info', function () {
        beforeEach(function () {
            log.level = log.levels.info;
        })
        it('should always log always', function () {
            //assert(capture(log, log.always, 'duh', 'info') === 'duh\n');
            log.always('duh');
            captured.should.equal('duh\n');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'info') === 'duh\n');
            log.error('duh');
            captured.should.equal('duh\n');
        })
        it('should always log warn', function () {
            log.warn('duh');
            captured.should.equal('duh\n');
        })
        it('should always log info', function () {
            //assert(capture(log, log.info, 'duh', 'info') === 'duh\n');
            log.info('duh');
            captured.should.equal('duh\n');
        })
        it('should never log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'info') === '');
            log.debug('duh');
            captured.should.be.empty;
        })
    })
    describe('#debug', function () {
        beforeEach(function () {
            log.level = log.levels.debug;
        })
        it('should always log always', function () {
            //assert(capture(log, log.always, 'duh', 'debug') === 'duh\n');
            log.always('duh');
            captured.should.equal('duh\n');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'debug') === 'duh\n');
            log.error('duh');
            captured.should.equal('duh\n');
        })
        it('should always log warn', function () {
            log.warn('duh');
            captured.should.equal('duh\n');
        })
        it('should always log info', function () {
            //assert(capture(log, log.info, 'duh', 'debug') === 'duh\n');
            log.info('duh');
            captured.should.equal('duh\n');
        })
        it('should always log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'debug') === 'duh\n');
            log.debug('duh');
            captured.should.equal('duh\n');
        })
    })
    describe('#debugObject', function() {
        beforeEach(function () {
            log.level = log.levels.debug;
        })
        it('should output delimiters plus object serialized', function () {
            log.debugObject({"thing" : "otherThing"});
            captured.should.equal('__DEBUG_OBJECT__{"thing":"otherThing"}__DEBUG_OBJECT__\n');
        })
    })
})
