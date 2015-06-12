assert = require('assert');
var capturer = function() {
	return {
		message : '',
		log : function(message) {
			this.message = this.message + message;
		},
		reset : function() {
			message = '';
		}
	}
};
describe('Log', function() {
	log = require('../src/movie-log.js');
	var cap = capturer();
	log.target = cap.log;
	describe('#always', function() {
		log.level = 'error';
		log.target = cap;
		it('should always log', function(done) {
			console.log('1');
			log.always('duh');
			console.log('2');
			assert.equals(cap.message === 'duh');
			console.log('3');
			done();
		})
		cap.reset();
		it('should log when error', function(done) {
			log.error('duh');
			assert.equals(cap.message === 'duh');
			done();
		})
		cap.reset();
		it('should log when info', function(done) {
			log.info('duh');
			assert.equals(cap.message === 'duh');
			done();
		})
		it('should log when debug', function(done) {
			log.debug('duh');
			assert.equals(cap.message === 'duh');
			done();
		})
	})
})
