var capture = function() {
	
}
describe('Queue', function() {
	queue = require('../src/moviedb-queue.js');
	describe('#always', function() {
		it('should always log always', function() {
			assert(capture(log, log.always, 'duh', 'always') === 'duh');
		})
	})
})