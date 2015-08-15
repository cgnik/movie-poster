var testConfig = {testConfig: '1'};
describe('MovieDbQueue', function () {
    var mockMoviedb = module.require("moviedb")('test-moviedb-key');
    var mockLog = sinon.mock(require('../src/movie-log.js'));
    var queue = require('../src/moviedb-queue.js')({moviedb: mockMoviedb, log: mockLog});
    beforeEach(function () {
        sinon.stub(mockMoviedb, 'configuration').callsArgWith(1, null, testConfig);
    })
    afterEach(function () {
        mockMoviedb.configuration.restore();
    })
    describe('#configure', function () {
        it('calls moviedb get configuration', function (done) {
            setTimeout(function () {
                queue.configure(function (config) {
                    expect(config).to.equal(testConfig);
                    done();
                })
            }, TIMEOUT);
        })
    })
    describe('#matchMovieName', function () {
        var testList = [
            {id: 123, title: "Movie"},
            {id: 456, title: "Movie Name"},
            {id: 789, title: "Movie Name More"}
        ];
        it('returns an exact match', function () {
            expect(queue.matchMovieName("Movie Name", testList)).to.equal(456);
        });
        it('returns null for no match', function () {
            expect(queue.matchMovieName("blargh", testList))
        })
        it('throws for a null name', function () {
            expect(queue.matchMovieName.bind(null, testList)).to.throw();
        })
        it('throws for a null list', function () {
            expect(queue.matchMovieName.bind("booboo", null)).to.throw();
        })
        it('matches near titles', function () {
            expect(queue.matchMovieName("ovie N", testList)).to.equal(456);
            expect(queue.matchMovieName("Mov", testList)).to.equal(123);
        })

    });
})