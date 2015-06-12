assert = require('assert');
var capture = function(log, callback, message) {
	var out = '';
	log.target = function(message) {
		out = message;
	};
	callback(message);
	return out;
};
describe('Log', function() {
	describe('#always', function() {
		log = require('../src/movie-log.js');
		log.level = 'always';
		it('should always log always', function() {
			assert(capture(log, log.always, 'duh') === 'duh');
		})
		it('should always log error', function() {
			assert(capture(log, log.error, 'duh') === 'duh');
		})
		it('should always log info', function() {
			assert(capture(log, log.info, 'duh') === 'duh');
		})
		it('should always log debug', function() {
			assert(capture(log, log.debug, 'duh') === 'duh');
		})
	})
	describe('#error', function() {
		log = require('../src/movie-log.js');
		log.level = 'error';
		it('should always log always', function() {
			assert(capture(log, log.always, 'duh') === 'duh');
		})
		it('should always log error', function() {
			assert(capture(log, log.error, 'duh') === 'duh');
		})
		it('should never log info', function() {
			assert(capture(log, log.info, 'duh') === '');
		})
		it('should never log debug', function() {
			assert(capture(log, log.debug, 'duh') === '');
		})
	})
})
