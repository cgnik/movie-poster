var expect = require('chai').expect;

var capture = function () {

}
describe('MovieDbQueue', function () {
    queue = require('../src/moviedb-queue.js')({themoviedbKey: 'test-moviedb-key'});
    describe('#findMovieId', function () {
        var result = '';
        beforeEach(function () {
            setTimeout(function () {
                result = capture(log, log.always, 'duh', 'always');
            }, 50)
        })
        it('should always log always', function () {
            expect(result).equal('duh');
        })
    })
})