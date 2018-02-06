movieDbKey = "test-moviedb-key";
let mdb = rewire('../src/mdb');

describe("mdb", () => {
   describe('#config', () => {
      let moviedb = null;
      beforeEach(() => {
         moviedb = {configuration: sinon.stub()};
         mdb.__set__('moviedb', moviedb);
      });
      it('calls moviedb to find movie, calls callback with results', (done) => {
         let expected = {a: 'b'};
         moviedb.configuration.returns(Promise.resolve({images: {base_url: expected}}));
         mdb.config().then(result => {
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
         mdb.__set__('moviedb', moviedb);
      });
      it('calls moviedb to find movie, calls callback with results', (done) => {
         moviedb.search.movies.returns(Promise.resolve(testResults));
         mdb.search("Test Movie").then(result => {
            result.should.deep.equal(testResults.results);
            moviedb.search.movies.should.have.been.calledOnce;
            done();
         }).catch(console.error);
      });
      it('errors when called with a null movie name', () => {
         expect(mdb.search.bind(null)).should.throw;
      });
   });
   describe('#poster', () => {
      let fetch = null;
      beforeEach(() => {
         fetch = sinon.stub();
         mdb.__set__('fetch', fetch);
      });
      it('assembles a url and fetches it', (done) => {
         let expected = {status : 200, body: "wakka"};
         fetch.returns(Promise.resolve(expected));
         mdb.poster("hurk/", {poster_path: '/blah'}).then(result => {
            result.should.deep.equal(expected.body);
            fetch.should.have.been.calledOnce;
            done();
         }).catch(console.error);
      });
   });
});
