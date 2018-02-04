movieDbKey = "test-moviedb-key";
let simplified = rewire('../src/simplified-mdb');
let under = simplified;

describe("simplified", () => {

   describe('#config', () => {
      let moviedb = null;
      beforeEach(() => {
         moviedb = {configuration: sinon.stub()};
         simplified.__set__('moviedb', moviedb);
      });
      it('calls moviedb to find movie, calls callback with results', (done) => {
         let expected = {a: 'b'};
         moviedb.configuration.returns(Promise.resolve(expected));
         under.config().then(result => {
            result.should.deep.equal(expected);
            done();
         });
         moviedb.configuration.should.have.been.calledOnce;
      });
   });
   describe('#search', () => {
      let testResults = {results: [{id: 123, title: "Movie 123"}, {id: 345, title: "Movie 345"}]};
      let moviedb = null;
      beforeEach(() => {
         moviedb = {
            common: {api_key: ''},
            search: {movies: sinon.stub()}
         };
         simplified.__set__('moviedb', moviedb);
      });
      it('calls moviedb to find movie, calls callback with results', (done) => {
         moviedb.search.movies.returns(Promise.resolve(testResults));
         under.search("Test Movie").then(result => {
            result.should.deep.equal(testResults.results);
            moviedb.search.movies.should.have.been.calledOnce;
            done();
         }).catch(console.error);
      });
      it('errors when called with a null movie name', () => {
         expect(under.search.bind(null)).should.throw;
      });
   });
});
