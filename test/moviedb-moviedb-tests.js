describe('MovieDbMovieDb', function () {
   const MovieDbMovieDb = MoviePoster.MovieDbMovieDb;
   var mockMoviedb = sinon.mock();
   mockMoviedb.configuration = sinon.stub();
   var mdb = new MovieDbMovieDb({moviedb: mockMoviedb});
   var testConfig = {testConfig: '1'};

   describe('#searchMovies', function () {
      var testResults = {results: [{id: 123, title: "Movie 123"}, {id: 345, title: "Movie 345"}]};
      beforeEach(function () {
         sinon.stub(mockMoviedb, 'searchMovie').callsArgWith(1, null, testResults);
      });
      afterEach(function () {
         mockMoviedb.searchMovie.restore();
      });
      it('calls moviedb to find movie, calls callback with results', function (done) {
         mdb.searchMovies("Test Movie").should.eventually.equal({
            movieName: "Test Movie",
            searchResults: testResults
         });
      });
      it('errors when called with a null movie name', function () {
         expect(mdb.searchMovies.bind(mdb, null, null, null)).to.throw();
         expect(mdb.searchMovies.bind(mdb, "Blah", null, shouldntFunc)).to.throw();
         expect(mdb.searchMovies.bind(mdb, null, shouldntFunc, shouldntFunc)).to.throw();
      });
      it('throws when given a null movie id', function () {
         expect(mdb)
      })
   });
   describe('#findBestTitleMatch', function () {
      var testList = [
         {id: 123, title: "Movie"},
         {id: 456, title: "Movie Name"},
         {id: 789, title: "Movie Name More"}
      ];
      it('returns an exact match', function () {
         expect(mdb.findBestTitleMatch("Movie Name", testList)).to.equal(456);
      });
      it('returns null for no match', function () {
         expect(mdb.findBestTitleMatch("blargh", testList))
      });
      it('throws for a null name', function () {
         expect(mdb.findBestTitleMatch.bind(mdb, null, testList)).to.throw();
      });
      it('throws for a null list', function () {
         expect(mdb.findBestTitleMatch.bind(mdb, "booboo", null)).to.throw();
      });
      it('matches near titles', function () {
         expect(mdb.findBestTitleMatch("ovie N", testList)).to.equal(456);
         expect(mdb.findBestTitleMatch("Mov", testList)).to.equal(123);
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
         }
         ]
      };
      beforeEach(function () {
         sinon.stub(mockMoviedb, 'movieImages').callsArgWith(1, null, testImages);
      });
      afterEach(function () {
         mockMoviedb.movieImages.restore();
      });
      // like, tests, 'n' stuff.
      it('should call the moviedb api to fetch the image list', function (done) {
         mdb.on('moviedb:poster:complete', function (movieId, imagelist, error) {
            expect(error).to.be.undefined;
            movieId.should.equal(123);
            imagelist.should.deep.equal(testImages.posters);
            done();
         });
         mdb.fetchMovieImages(123);
      })
   });
});