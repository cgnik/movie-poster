
const fileListMapResult = {
   something: {
      name: 'something',
      file: '/path/something.m4v',
      image: '/path/something.png',
      directory: '/path/'
   },
   other: {
      name: 'other',
      file: '/path/other.m4v',
      directory: '/path/'
   }
};


describe('MovieListFile', () => {
   let MovieListFile = rewire('../src/movie-list-file.js');
   describe('#load', () => {
      let fs = null;
      let mm = null;
      beforeEach(() => {
         fs = {
            existsSync: sinon.stub(),
            readFileSync: sinon.stub(),
            statSync: sinon.stub()
         };
         MovieListFile.__set__('fs', fs);
         mm = new MovieListFile('/some/dir/');
      });
      it('should look for and load the file', () => {
         fs.readFileSync.withArgs(mm._persistentMapFileName).returns(JSON.stringify(fileListMapResult));
         fs.existsSync.withArgs(mm._persistentMapFileName).returns(true);
         fs.statSync.withArgs(mm._persistentMapFileName).returns({
            isFile: function () {
               return true;
            }
         });
         mm.load();
         mm.movies.should.deep.equal(fileListMapResult);
      });
      it('should not try to load when there is no map file', () => {
         fs.existsSync.withArgs(mm._persistentMapFileName).returns(false);
         fs.readFileSync.withArgs(mm._persistentMapFileName).throws;
         fs.statSync.withArgs(mm._persistentMapFileName).returns({
            isFile: function () {
               return false;
            }
         });
         mm.load();
         mm.movies.should.deep.equal({});
      })
   });
   describe('#persist', () => {
      beforeEach(() => {
         fs = {
            existsSync: sinon.stub(),
            readFileSync: sinon.stub(),
            statSync: sinon.stub(),
            writeFileSync: sinon.stub()
         };
         MovieListFile.__set__('fs', fs);
         mm = new MovieListFile('/some/dir/');
      });
      it('should try to save the current movie map to a file', () => {
         fs.writeFileSync = sinon.stub();
         mm.directory = "./";
         mm.movies = fileListMapResult;
         mm.persist();
         fs.writeFileSync.should.have.been.calledWith(mm._persistentMapFileName, JSON.stringify(fileListMapResult));
      })
   })
});