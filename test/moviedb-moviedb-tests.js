const mockFetch = require('fetch-mock');

describe('MovieDbMovieDb', function () {
   const MovieDbMovieDb = MoviePoster.MovieDbMovieDb;
   let mockMdb = null;
   let mdb = null;

   describe('#constructor', () => {
      it('throws when no moviedb key is provided', () => {
         expect(MovieDbMovieDb.bind({moviedb: mockMdb})).to.throw;
      });
      it('throws when nothing is provided', () => {
         expect(MovieDbMovieDb.bind()).to.throw;
      });
   });

   describe('#searchMovies', function () {
      var testResults = {results: [{id: 123, title: "Movie 123"}, {id: 345, title: "Movie 345"}]};
      beforeEach(function () {
         mockMdb = {
            common: {api_key: ''},
            search: {getMovie: sinon.stub()}
         };
         mdb = new MovieDbMovieDb({themoviedbKey: 'testKey', moviedb: mockMdb});
      });
      afterEach(function () {
      });
      it('calls moviedb to find movie, calls callback with results', function () {
         let testResults = {testResult: 1};
         mockMdb.search.getMovie.callsArgWith(2, testResults);
         mdb.searchMovies("Test Movie").catch(err => {
            console.error(err);
            assert(false);
         }).should.eventually.equal({
            movieName: "Test Movie",
            searchResults: testResults
         });
         mockMdb.search.getMovie.should.have.been.calledOnce;
      });
      it('errors when called with a null movie name', function () {
         expect(mdb.searchMovies.bind(null)).should.throw;
      });
      it('throws when given a null movie id', function () {
         mdb.searchMovies("Test Movie").catch(err => {
            console.error(err);
            assert(false);
         }).should.throw;
      })
   });
   describe('#findBestTitleMatch', function () {
      var testList = [
         {id: 123, title: "Movie"},
         {id: 456, title: "Movie Name"},
         {id: 789, title: "Movie Name More"}
      ];
      it('returns an exact match', function () {
        mdb.findBestTitleMatch("Movie Name", testList).should.equal(456);
      });
      it('returns null for no match', function () {
         mdb.findBestTitleMatch("blargh", testList)
      });
      it('throws for a null name', function () {
         mdb.findBestTitleMatch.bind(mdb, null, testList).should.throw();
      });
      it('throws for a null list', function () {
         mdb.findBestTitleMatch.bind(mdb, "booboo", null).should.throw();
      });
      it('matches near titles', function () {
         mdb.findBestTitleMatch("ovie N", testList).should.equal(456);
         mdb.findBestTitleMatch("Mov", testList).should.equal(123);
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
         expect(mdb.findBestPoster.bind(mdb, null, {})).to.throw();
      });
      it('should throw if no list was provided', function () {
         expect(mdb.findBestPoster.bind(mdb, '', null)).to.throw();
      });
      it('should return null if the list is empty', function () {
         expect(mdb.findBestPoster(123, [])).to.be.undefined;
      });
      it('should return a file path for a straight match', function () {
         expect(mdb.findBestPoster(123, testMovieList)).to.equal("/success/result");
      });
      it('should return a file path for an english over a non-english match', function () {
         expect(mdb.findBestPoster(123, testMovieListForeign)).to.equal("/success/english");
      });
      it('should return the first image even if nothing matches expected state', function () {
         expect(mdb.findBestPoster(123, testMovieListForeignNoEnglish)).to.equal("/success/french");
      })
   });
   describe('#fetchMovieImages', function () {
      testImages = {
         posters: [{"iso_639_1": "en", "file_path": "/some/path.png"}, {
            "iso_639_1": "fr",
            "file_path": "/other/else.png"
         }]
      };
      beforeEach(function () {
         mockMdb = {
            common: {api_key: ''},
            movies: {getImages: sinon.stub()}
         };
         mdb = new MovieDbMovieDb({themoviedbKey: 'testKey', moviedb: mockMdb});
      });
      it('should call the moviedb api to fetch the image list', function () {
         const testResult = {
            movieId: 123,
            images: testImages.posters
         };
         mockMdb.movies.getImages.callsArgWith(1, testImages);
         mdb.fetchMovieImages(123).catch(err => {
            console.error(err);
            assert(false);
         }).should.eventually.deep.equal(testResult)
      });
   });
});