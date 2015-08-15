var testConfig = {testConfig: '1'};
var shouldntFunc = function () {
    assert(false);
};
describe('MovieDbMovieDb', function () {
    var mockMoviedb = module.require("moviedb")('test-moviedb-key');
    var mockLog = sinon.mock(require('../src/movie-log.js'));
    var queue = require('../src/moviedb-moviedb.js')({moviedb: mockMoviedb, log: mockLog});
    describe('#configure', function () {
        beforeEach(function () {
            sinon.stub(mockMoviedb, 'configuration').callsArgWith(1, null, testConfig);
        })
        afterEach(function () {
            mockMoviedb.configuration.restore();
        })
        it('calls moviedb get configuration', function (done) {
            setTimeout(function () {
                queue.configure(function (config) {
                    expect(config).to.equal(testConfig);
                    done();
                })
            }, TIMEOUT);
        })
    })
    describe('#searchMovies', function () {
        var testResults = {results: [{id: 123, title: "Movie 123"}, {id: 345, title: "Movie 345"}]};
        beforeEach(function () {
            sinon.stub(mockMoviedb, 'searchMovie').callsArgWith(1, "Movie 123", testResults);
        })
        afterEach(function () {
            mockMoviedb.searchMovie.restore();
        })
        it('calls moviedb to find movie, calls callback with results', function (done) {
            setTimeout(function () {
                queue.searchMovies("Test Movie", function (movieName, searchResults) {
                    expect(movieName).to.equal("Test Movie");
                    expect(JSON.stringify(searchResults)).to.equal(JSON.stringify(testResults.results));
                    done();
                })
            }, TIMEOUT);
        })
        it('errors when called with a null movie name', function () {
            expect(queue.searchMovies.bind(null, null, null)).to.throw();
            expect(queue.searchMovies.bind("Blah", null, shouldntFunc)).to.throw();
            expect(queue.searchMovies.bind(null, shouldntFunc, shouldntFunc)).to.throw();
        });
        it('calls the failback when given a null movie id', function (done) {
            setTimeout(function () {
                queue.searchMovies("Test Movie", function () {
                        assert(false);
                        return;
                    },
                    function (movieName, searchResults) {
                        done();
                    }
                )
            }, TIMEOUT);
        })
    })
    describe('#findBestTitleMatch', function () {
        var testList = [
            {id: 123, title: "Movie"},
            {id: 456, title: "Movie Name"},
            {id: 789, title: "Movie Name More"}
        ];
        it('returns an exact match', function () {
            expect(queue.findBestTitleMatch("Movie Name", testList)).to.equal(456);
        });
        it('returns null for no match', function () {
            expect(queue.findBestTitleMatch("blargh", testList))
        })
        it('throws for a null name', function () {
            expect(queue.findBestTitleMatch.bind(null, testList)).to.throw();
        })
        it('throws for a null list', function () {
            expect(queue.findBestTitleMatch.bind("booboo", null)).to.throw();
        })
        it('matches near titles', function () {
            expect(queue.findBestTitleMatch("ovie N", testList)).to.equal(456);
            expect(queue.findBestTitleMatch("Mov", testList)).to.equal(123);
        })
    });
    describe('#searchMovies', function () {
        it('should throw if no movie name provided', function () {
            //expect(queue.searchMovies)
        })
    })
    describe('#findBestPoster', function () {
        var testMovieList = [{iso_639_1: 'en', file_path: "/success/result"}];
        var testMovieListForeign = [
            {
                iso_639_1: 'fr',
                file_path: "/success/french"
            }, {
                iso_639_1: 'eN',
                file_path: "/success/english"
            }];
        var testMovieListForeignNoEnglish = [
            {
                iso_639_1: 'fr',
                file_path: "/success/french"
            }, {
                iso_639_1: 'it',
                file_path: "/success/italian"
            }];
        it('should throw if no id was provided', function () {
            expect(queue.findBestPoster.bind(null, {})).to.throw();
        })
        it('should throw if no list was provided', function () {
            expect(queue.findBestPoster.bind('', '', null)).to.throw();
        })
        it('should return null if the list is empty', function () {
            expect(queue.findBestPoster(123, [])).to.equal(null);
        })
        it('should return a file path for a straight match', function () {
            expect(queue.findBestPoster(123, testMovieList)).to.equal("/success/result");
        })
        it('should return a file path for an english over a non-english match', function () {
            expect(queue.findBestPoster(123, testMovieListForeign)).to.equal("/success/english");
        })
        it('should return the first image even if nothing matches expected state', function () {
            expect(queue.findBestPoster(123, testMovieListForeignNoEnglish)).to.equal("/success/french");
        })
    })
    describe('#fetchMovieImages', function () {
    });
})