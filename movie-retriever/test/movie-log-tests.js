assert = require('assert');
var capture = function(log, callback, message, level) {
	var out = '';
	log.level = level;
	log.target = function(message) {
		out = message;
	};
	callback(message);
	return out;
};
describe('Log', function() {
	log = require('../src/movie-log.js');
	describe('#always', function() {
		it('should always log always', function() {
			assert(capture(log, log.always, 'duh', 'always') === 'duh');
		})
		it('should always log error', function() {
			assert(capture(log, log.error, 'duh', 'always') === 'duh');
		})
		it('should always log info', function() {
			assert(capture(log, log.info, 'duh', 'always') === 'duh');
		})
		it('should always log debug', function() {
			assert(capture(log, log.debug, 'duh', 'always') === 'duh');
		})
	});
	describe('#error', function() {
		it('should always log always', function() {
			assert(capture(log, log.always, 'duh', 'error') === 'duh');
		})
		it('should always log error', function() {
			assert(capture(log, log.error, 'duh', 'error') === 'duh');
		})
		it('should never log info', function() {
			assert(capture(log, log.info, 'duh', 'error') === '');
		})
		it('should never log debug', function() {
			assert(capture(log, log.debug, 'duh', 'error') === '');
		})
	});
})
