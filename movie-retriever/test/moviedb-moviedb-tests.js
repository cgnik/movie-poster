MovieDbMovieDb = require('../src/moviedb-moviedb.js');

var testConfig = {testConfig: '1'};
var shouldntFunc = function () {
    assert(false);
};
describe('MovieDbMovieDb', function () {
    var mockMoviedb = module.require("moviedb")('test-moviedb-key');
    var mockLog = sinon.mock(require('../src/movie-log.js'));
    var movieDbMovieDb = new MovieDbMovieDb({moviedb: mockMoviedb, log: mockLog});
    describe('#configure', function () {
        beforeEach(function () {
            sinon.stub(mockMoviedb, 'configuration').callsArgWith(1, null, testConfig);
        })
        afterEach(function () {
            mockMoviedb.configuration.restore();
        })
        it('calls moviedb get configuration', function (done) {
            setTimeout(function () {
                movieDbMovieDb.configure(function (config) {
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
                movieDbMovieDb.searchMovies("Test Movie", function (movieName, searchResults) {
                    movieName.should.equal("Test Movie");
                    searchResults.should.deep.equal(testResults.results);
                    done();
                })
            }, TIMEOUT);
        })
        it('errors when called with a null movie name', function () {
            expect(movieDbMovieDb.searchMovies.bind(movieDbMovieDb, null, null, null)).to.throw();
            expect(movieDbMovieDb.searchMovies.bind(movieDbMovieDb, "Blah", null, shouldntFunc)).to.throw();
            expect(movieDbMovieDb.searchMovies.bind(movieDbMovieDb, null, shouldntFunc, shouldntFunc)).to.throw();
        });
        it('calls the failback when given a null movie id', function (done) {
            setTimeout(function () {
                movieDbMovieDb.searchMovies("Test Movie", function () {
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
            expect(movieDbMovieDb.findBestTitleMatch("Movie Name", testList)).to.equal(456);
        });
        it('returns null for no match', function () {
            expect(movieDbMovieDb.findBestTitleMatch("blargh", testList))
        })
        it('throws for a null name', function () {
            expect(movieDbMovieDb.findBestTitleMatch.bind(movieDbMovieDb, null, testList)).to.throw();
        })
        it('throws for a null list', function () {
            expect(movieDbMovieDb.findBestTitleMatch.bind(movieDbMovieDb, "booboo", null)).to.throw();
        })
        it('matches near titles', function () {
            expect(movieDbMovieDb.findBestTitleMatch("ovie N", testList)).to.equal(456);
            expect(movieDbMovieDb.findBestTitleMatch("Mov", testList)).to.equal(123);
        })
    });
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
            expect(movieDbMovieDb.findBestPoster.bind(movieDbMovieDb, null, {})).to.throw();
        })
        it('should throw if no list was provided', function () {
            expect(movieDbMovieDb.findBestPoster.bind(movieDbMovieDb, '', null)).to.throw();
        })
        it('should return null if the list is empty', function () {
            expect(movieDbMovieDb.findBestPoster(123, [])).to.be.empty;
        })
        it('should return a file path for a straight match', function () {
            expect(movieDbMovieDb.findBestPoster(123, testMovieList)).to.equal("/success/result");
        })
        it('should return a file path for an english over a non-english match', function () {
            expect(movieDbMovieDb.findBestPoster(123, testMovieListForeign)).to.equal("/success/english");
        })
        it('should return the first image even if nothing matches expected state', function () {
            expect(movieDbMovieDb.findBestPoster(123, testMovieListForeignNoEnglish)).to.equal("/success/french");
        })
    })
    describe('#fetchMovieImages', function () {
        testImages = {posters : [{"iso_639_1": "en", "file_path": "/some/path.png"}, {
            "iso_639_1": "fr",
            "file_path": "/other/else.png"}
        ]};
        beforeEach(function () {
            sinon.stub(mockMoviedb, 'movieImages').callsArgWith(1, 123, testImages);
        })
        afterEach(function () {
            mockMoviedb.movieImages.restore();
        })
        // like, tests, 'n' stuff.
        it('should call the moviedb api to fetch the image list', function (done) {
            setTimeout(function () {
                movieDbMovieDb.fetchMovieImages(123, function (movieId, imagelist) {
                    movieId.should.equal(123);
                    imagelist.should.deep.equal(testImages.posters);
                    done();
                })
            })
        })
    });
})