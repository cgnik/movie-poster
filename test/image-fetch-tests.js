describe('ImageFetch', () => {
   let fs = null;
   let fetchMock = require('fetch-mock');
   let ImageFetch = rewire('../src/image-fetch');
   let fetcher = null;
   let teststream = null;
   let testfile = null;
   const params = {
      baseUrl: 'BASEURL',
      imagePath: 'IMAGE/PATH',
      imageLoc: 'IMAGE/LOC',
      fileName: 'FILENAME',
      http: http,
      fs: fs
   };

   beforeEach(function () {
      teststream = {pipe: sinon.stub()};
      testfile = {write: sinon.stub()};
      fs = {writeFileSync: sinon.stub().returns(testfile)};
      ImageFetch.__set__('fetch', fetchMock);
      fetcher = new ImageFetch(params);
   });

   describe('#getUrl', () => {
      it('should assemble the url BASEURLw300IMAGE/LOC', () => {
         fetcher.getUrl().should.equal('BASEURLw300IMAGE/LOC');
      })
   });
   describe('#getExtension', () => {
      it('should return ".ext" for file.ext', () => {
         fetcher.imageLoc = 'file.ext';
         fetcher.getExtension().should.equal('.ext');
      });
      it('should return "" for file', () => {
         expect(fetcher.getExtension()).to.equal('');
      });
      it('should tolerate a null imageLoc', () => {
         fetcher.imageLoc = undefined;
         fetcher.getExtension.bind(fetcher, null).should.not.throw;
      })
   });
   describe('#getTargetFile', () => {
      it('should return "IMAGE/PATH/target.ext" for IMAGE/LOC, file', () => {
         fetcher.imageLoc = 'file.ext';
         fetcher.imagePath = 'IMAGE/PATH';
         fetcher.fileName = 'target';
         expect(fetcher.getTargetFile()).to
            .equal('IMAGE/PATH/target.ext');
      })
   });
   describe('#fetch', () => {
      it('should make a request to BASEURLw300IMAGE/LOC', () => {
         fetcher.fetch().then(data => assert(fs.writeFileSync.called)).catch((e) => {
            console.error(e);
            assert.fail(0, 1, "Error which should have failed the promise")
         });
      });
   })
});
