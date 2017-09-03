
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


describe('MovieListFile', function () {
   let MovieListFile = rewire('../src/movie-list-file.js');
   describe('#load', function () {
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
      it('should look for and load the file', function () {
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
      it('should not try to load when there is no map file', function () {
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
   describe('#persist', function () {
      beforeEach(() => {
         fs = {
            existsSync: sinon.stub(),
            readFileSync: sinon.stub(),
            statSync: sinon.stub()
         };
         MovieListFile.__set__('fs', fs);
         mm = new MovieListFile('/some/dir/');
      });
      it('should try to save the current movie map to a file', function () {
         mockStream = {
            close: sinon.stub(),
            write: sinon.stub()
         };
         mockStream.write.returns(mockStream);
         fs.createWriteStream = sinon.stub();
         fs.createWriteStream.withArgs(mm._persistentMapFileName).returns(mockStream);
         mm.directory = "./";
         mm.movies = fileListMapResult;
         mm.persist();
         fs.createWriteStream.should.have.been.calledWith(mm._persistentMapFileName);
         mockStream.write.should.have.been.calledWith(JSON.stringify(fileListMapResult));
         mockStream.close.should.have.been.calledOnce;
      })
   })
});