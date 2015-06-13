describe('Queue', function() {
	queue = require('../src/movie-queue.js');
	describe('#always', function() {
		it('should always log always', function() {
			assert(capture(log, log.always, 'duh', 'always') === 'duh');
		})
	})
})