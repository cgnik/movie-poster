let Meta = rewire('../src/meta-update');
describe('MetaUpdate', () => {
   let meta = null;
   let ff = null;
   let b4e = function () {
      meta = new Meta();
      ff = {
         read: sinon.stub(),
         write: sinon.stub()
      };
      Meta.__set__('meta', ff);
   };
   describe('#updateMovie', () => {
      beforeEach(b4e);
      it('only update the movie if there is something to update', () => {
         beforeEach(b4e);
         const testMovie = {
            file: '/some/file.mpg',
            name: 'Test TITLE'
         };
         const testMetaData = {
            title: testMovie.title
         };
         meta.updateMovie(testMovie);
         ff.read.callsArgWith(2, null, testMetaData);
         ff.read.should.have.been.calledOnce;
         ff.write.should.not.have.been.called;
      });
      it('updates the movie title and description', (done) => {
         beforeEach(b4e);
         const testMovie = {
            file: '/some/file.mpg',
            title: 'Test TITLE'
         };
         const testMetaData = {
            title: 'BooBoo',
            Description: 'TEST Description'
         };
         const testResult = {
            ContentType: 1,
            Title: testMovie.title
         };
         ff.read.callsArgWith(1, null, testMetaData);
         meta.updateMovie(testMovie).then(result => {
            result.should.deep.equal(testResult);
            ff.read.should.have.been.calledOnce;
            ff.write.should.have.been.calledOnce;
            done();
         }).catch(done);
      });
   });
});