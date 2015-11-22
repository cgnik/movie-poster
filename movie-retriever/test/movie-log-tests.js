
describe('Log', function () {
    beforeEach(function () {
        captured = '';
        log = require('../src/movie-log.js');
        log.target = function (blah) {
            captured += blah;
        };
    });
    describe('#always', function () {
        log.level = log.levels.always;
        it('should always log always', function () {
            log.always('duh');
            captured.should.equal('duh');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'always') === 'duh');
            log.always('duh');
            captured.should.equal('duh');
        })
        it('should always log info', function () {
            //assert(capture(log, log.info, 'duh', 'always') === 'duh');
            log.info('duh');
            captured.should.equal('duh');
        })
        it('should always log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'always') === 'duh');
            log.debug('duh');
            captured.should.equal('duh');
        })
    })
    describe('#error', function () {
        log.level = log.levels.error;
        it('should always log always', function () {
            //assert(capture(log, log.always, 'duh', 'error') === 'duh');
            log.always('duh');
            captured.should.equal('duh');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'error') === 'duh');
            log.error('duh');
            captured.should.equal('duh');
        })
        it('should never log info', function () {
            //assert(capture(log, log.info, 'duh', 'error') === '');
            log.info('duh');
            captured.should.equal('duh');
        })
        it('should never log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'error') === '');
            log.debug('duh');
            captured.should.equal('duh');
        })
    })
    describe('#info', function () {
        log.level = log.levels.info;
        it('should always log always', function () {
            //assert(capture(log, log.always, 'duh', 'info') === 'duh');
            log.always('duh');
            captured.should.equal('duh');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'info') === 'duh');
            log.error('duh');
            captured.should.equal('duh');
        })
        it('should always log info', function () {
            //assert(capture(log, log.info, 'duh', 'info') === 'duh');
            log.info('duh');
            captured.should.equal('duh');
        })
        it('should never log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'info') === '');
            log.debug('duh');
            captured.should.equal('duh');
        })
    })
    describe('#debug', function () {
        log.level = log.levels.debug;
        it('should always log always', function () {
            //assert(capture(log, log.always, 'duh', 'debug') === 'duh');
            log.always('duh');
            captured.should.equal('duh');
        })
        it('should always log error', function () {
            //assert(capture(log, log.error, 'duh', 'debug') === 'duh');
            log.error('duh');
            captured.should.equal('duh');
        })
        it('should always log info', function () {
            //assert(capture(log, log.info, 'duh', 'debug') === 'duh');
            log.info('duh');
            captured.should.equal('duh');
        })
        it('should always log debug', function () {
            //assert(capture(log, log.debug, 'duh', 'debug') === 'duh');
            log.debug('duh');
            captured.should.equal('duh');
        })
    })
    describe('#debugObject', function() {
        log.level = log.levels.debug;
        it('should output delimiters plus object serialized', function () {
            log.debugObject({"thing" : "otherThing"});
            captured.should.equal('__DEBUG_OBJECT__{"thing":"otherThing"}__DEBUG_OBJECT__');
        })
    })
})
