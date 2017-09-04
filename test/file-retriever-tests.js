describe('FileRetriever', () => {
   let fs = null;
   let FileRetriever = null; //rewire('../src/image-retrieve');
   let retriever = null;
   let teststream = null;
   let testfile = null;
   let fetch = null;
   const params = {
      baseUrl: 'BASEURL',
      imagePath: 'IMAGE/PATH',
      imageLoc: 'IMAGE/LOC',
      fileName: 'FILENAME',
      http: http,
      fs: fs
   };

   let b4e = function () {
      teststream = {pipe: sinon.stub()};
      testfile = {write: sinon.stub()};
      fs = {writeFileSync: sinon.stub().returns(testfile)};
      fetch = sinon.stub();
      FileRetriever = rewire('../src/file-retriever');
      FileRetriever.__set__('fetch', fetch);
      FileRetriever.__set__('fs', fs);
      retriever = new FileRetriever(params);
   };

   describe('#getUrl', () => {
      beforeEach(b4e);
      it('should assemble the url BASEURLw300IMAGE/LOC', () => {
         retriever.getUrl().should.equal('BASEURLw300IMAGE/LOC');
      })
   });
   describe('#getExtension', () => {
      beforeEach(b4e);
      it('should return ".ext" for file.ext', () => {
         retriever.params.imageLoc = 'file.ext';
         retriever.getExtension().should.equal('.ext');
      });
      it('should return "" for file', () => {
         expect(retriever.getExtension()).to.equal('');
      });
      it('should tolerate a null imageLoc', () => {
         retriever.params.imageLoc = undefined;
         retriever.getExtension.bind(retriever, null).should.not.throw;
      })
   });
   describe('#getTargetFile', () => {
      beforeEach(b4e);
      it('should return "IMAGE/PATH/target.ext" for IMAGE/LOC, file', () => {
         retriever.params.imageLoc = 'file.ext';
         retriever.params.imagePath = 'IMAGE/PATH';
         retriever.params.fileName = 'target';
         expect(retriever.getTargetFile()).to
            .equal('IMAGE/PATH/target.ext');
      })
   });
   describe('#retrieve', () => {
      beforeEach(b4e);
      it('should make a request to BASEURLw300IMAGE/LOC', (done) => {
         fetch.returns(Promise.resolve({
            blob() {
               return Promise.resolve('blah');
            }, status: 200
         }));
         retriever.retrieve().then(data => {
            fs.writeFileSync.should.have.been.called;
            data.should.deep.equal('blah')
            done();
         }).catch((e) => {
            done(e);
         });
      });
   })
});
