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
    describe('#matchMovieImage', function () {
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
            expect(queue.matchMovieImage.bind(null, {}, {})).to.throw();
        })
        it('should throw if no name was provided', function () {
            expect(queue.matchMovieImage.bind({}, null, {})).to.throw();
        })
        it('should throw if no list was provided', function () {
            expect(queue.matchMovieImage.bind('', '', null)).to.throw();
        })
        it('should return null if the list is empty', function () {
            expect(queue.matchMovieImage(123, "blah", [])).to.equal(null);
        })
        it('should return a file path for a straight match', function () {
            expect(queue.matchMovieImage(123, "Movie Name", testMovieList)).to.equal("/success/result");
        })
        it('should return a file path for an english over a non-english match', function () {
            expect(queue.matchMovieImage(123, "Movie Name", testMovieListForeign)).to.equal("/success/english");
        })
        it('should return the first image even if nothing matches expected state', function() {
            expect(queue.matchMovieImage(123, "Movie Bob", testMovieListForeignNoEnglish)).to.equal("/success/french");
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