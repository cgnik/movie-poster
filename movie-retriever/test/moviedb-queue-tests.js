describe('MovieDbQueue', function () {
    this.queue = require('../src/moviedb-queue.js')({themoviedbKey: 'test-moviedb-key'});
    describe('#configure', function (done) {
        it('call moviedb get configuration', function () {
            setTimeout(function () {
                done();
            }, TIMEOUT)
        })
    })
})