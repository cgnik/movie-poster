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
         let testMovie = {
            file: '/some/file.mpg',
            title: 'Test TITLE'
         };
         let testMetaData = {
            title: testMovie.title
         };
         meta.updateMovie(testMovie);
         ff.read.callsArgWith(1, testMetaData);
         ff.read.should.have.been.calledOnce;
         ff.write.should.not.have.been.called;
      });
   });
});