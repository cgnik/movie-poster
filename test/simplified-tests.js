movieDbKey = "test-moviedb-key";
let simplified = rewire('../src/simplified');
let under = simplified;

describe("simplified", () => {
   describe('#Util', () => {
      describe('Earrlast', () => {
         it('should tolerate null arg', () => {
            under.arrlast().should.equal('');
         });
      });
   });
   describe('Files', () => {
      describe('#files', () => {
         let fs = null;
         beforeEach(() => {
            fs = {
               readdirSync: sinon.stub(),
               statSync: sinon.stub()
            };
            simplified.__set__('fs', fs);
         });
         it('should list all files in the specified directory', () => {
            let expectedDir = '/derpa/derpy/derp/';
            let expectedFiles = ["fil.e", "nam.e"];

            fs.readdirSync.withArgs(expectedDir).returns(expectedFiles);
            fs.statSync.withArgs(expectedFiles[0]).returns({isFile: () => true});
            fs.statSync.withArgs(expectedFiles[1]).returns({isFile: () => false});

            let result = under.files(expectedDir);

            fs.statSync.should.have.been.calledWith(expectedFiles[0]);
            fs.statSync.should.have.been.calledWith(expectedFiles[1]);
            fs.readdirSync.should.have.been.calledWith('/derpa/derpy/derp/');
            result.should.deep.equal([expectedFiles[0]]);
         });
         it('should tolerate missing args', () => {
            result = under.files();
            result.should.deep.equal([])
         });
      });
      describe('#fileparts', () => {
         it('should split dotted names', () => {
            under.fileparts('x.y').should.deep.equal(['x', 'y']);
            under.fileparts('x.y.z').should.deep.equal(['x', 'y', 'z']);
         });
         it('should tolerate spaces', () => {
            under.fileparts('x y.z').should.deep.equal(['x y', 'z']);
         });
      });
      describe('#isExtension', () => {
         const extensions = simplified.MOVIE_EXTENSIONS;
         it('should tolerate empty inputs', () => {
            under.isExtension().should.be.false;
         });
         it('should only return true for filenames with case-insensitive movie extensions', () => {
            under.isExtension("file.mkv", extensions).should.be.true;
            under.isExtension("file.m4v", extensions).should.be.true;
            under.isExtension("file.jpg", extensions).should.be.false;
            under.isExtension("filemkv", extensions).should.be.false;
            under.isExtension("fiLe.mKv", extensions).should.be.true;
            under.isExtension("file.M4V", extensions).should.be.true;
            under.isExtension("file.JpG", extensions).should.be.false;
            under.isExtension("filemkv", extensions).should.be.false;
         });
      });
      describe('#isMovie', () => {
         it('should detect movie files by extension', () => {
            under.isMovie().should.be.false;
            under.isMovie("file.mkv").should.be.true;
            under.isMovie("file.m4v").should.be.true;
            under.isMovie("file.JpG").should.be.false;
         });
      });
      describe('#isImage', () => {
         it('should detect movie files by extension', () => {
            under.isImage().should.be.false;
            under.isImage("file.mkv").should.be.false;
            under.isImage("file.m4v").should.be.false;
            under.isImage("file.JpG").should.be.true;
         });
      });
      describe('#images', () => {
         it('should only return filenames with movie extensions', () => {
            under.images().should.deep.equal([])
            under.images(['1.mkv', '2.jPg', '3.oink']).should.deep.equal(['2.jPg'])
            under.images(['1.mkV', '2.jPg', '3.m4v']).should.deep.equal(['2.jPg'])
         });
      });
      describe('#movies', () => {
         it('should only return filenames with movie extensions', () => {
            under.movies().should.deep.equal([])
            under.movies(['1.mkv', '2.jpg', '3.oink']).should.deep.equal(['1.mkv'])
            under.movies(['1.mkV', '2.jPg', '3.m4v']).should.deep.equal(['1.mkV', '3.m4v'])
         });
      });
      describe('write', () => {
         let stream = null;
         let fs = null;
         beforeEach(() => {
            stream = {pipe: sinon.stub()};
            fs = {createWriteStream: sinon.stub()};
            under.__set__('fs', fs)
         });
         it('should tolerate null parameters', () => {
            under.write.bind().should.not.throw;
         });
         it('should write the stream to a file', () => {
            let expectedName = 'stupid';
            under.write(stream, expectedName);
            stream.pipe.should.have.been.calledOnce;
            fs.createWriteStream.should.have.been.calledWith(expectedName);
         });
      });
   });
   describe('Movies', () => {
      describe('#titleMatch', () => {
         let testList = [
            "Movie",
            "Movie Name",
            "Movie Name More"
         ];
         it('returns an exact match', () => {
            under.titleMatch("Movie Name", testList).should.equal(1);
         });
         it('returns -1 for no match', () => {
            under.titleMatch("blargh", testList).should.equal(-1)
         });
         it('matches near titles', () => {
            under.titleMatch("ovie N", testList).should.equal(1);
            under.titleMatch("Mov", testList).should.equal(0);
            under.titleMatch("ame m", testList).should.equal(2);
         });
      });
      describe('#movieConfig', () => {
         let moviedb = null;
         beforeEach(() => {
            moviedb = {configuration: sinon.stub()};
            simplified.__set__('moviedb', moviedb);
         });
         it('calls moviedb to find movie, calls callback with results', (done) => {
            let expected = {a: 'b'};
            moviedb.configuration.returns(Promise.resolve(expected));
            under.movieConfig().then(result => {
               result.should.deep.equal(expected);
               done();
            });
            moviedb.configuration.should.have.been.calledOnce;
         });
      });
      describe('#movieSearch', () => {
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
            under.movieSearch("Test Movie").then(result => {
               result.should.deep.equal(testResults.results);
               moviedb.search.movies.should.have.been.calledOnce;
               done();
            }).catch(console.error);
         });
         it('errors when called with a null movie name', () => {
            expect(under.movieSearch.bind(null)).should.throw;
         });
      });
   });
});
