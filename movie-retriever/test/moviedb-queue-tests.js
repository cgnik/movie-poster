describe('MovieDbQueue', function () {
    this.queue = require('../src/moviedb-queue.js')({themoviedbKey: 'test-moviedb-key'});
    describe('#configure', function () {
        var result = '';
        beforeEach(function () {
            setTimeout(function () {
                result = capture(log, log.always, 'duh', 'always');
            }, TIMEOUT)
        })
        it('should always log always', function () {
            expect(result).equal('duh');
        })
    })
})