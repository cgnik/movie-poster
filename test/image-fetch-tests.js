fs = require('fs');

const fetchMock = require('fetch-mock');

describe('ImageFetch', function () {
   beforeEach(function () {
      teststream.pipe = sinon.stub();
      sinon.stub(http, 'get').returns(teststream);
      testfile.write = sinon.stub();
      sinon.stub(fs, 'writeFileSync').returns(testfile);
   });
   afterEach(function () {
      http.get.restore();
      fs.writeFileSync.restore();
   });

   describe('#getUrl', function () {
      it('should assemble the url BASEURLw300IMAGE/LOC', function () {
         ffetcher().getUrl().should.equal('BASEURLw300IMAGE/LOC');
      })
   });
   describe('#getExtension', function () {
      it('should return ".ext" for file.ext', function () {
         fetcher = ffetcher();
         fetcher.imageLoc = 'file.ext';
         fetcher.getExtension().should.equal('.ext');
      });
      it('should return "" for file', function () {
         fetcher = ffetcher();
         expect(fetcher.getExtension()).to.equal('');
      });
      it('should tolerate a null imageLoc', function () {
         fetcher = ffetcher();
         fetcher.imageLoc = undefined;
         fetcher.getExtension.bind(fetcher, null).should.not.throw;
      })
   });
   describe('#getTargetFile', function () {
      it('should return "IMAGE/PATH/target.ext" for IMAGE/LOC, file',
         function () {
            fetcher = ffetcher();
            fetcher.imageLoc = 'file.ext';
            fetcher.imagePath = 'IMAGE/PATH';
            fetcher.fileName = 'target';
            expect(fetcher.getTargetFile()).to
               .equal('IMAGE/PATH/target.ext');
         })
   });
   describe('#fetch', function () {
      it('should make a request to BASEURLw300IMAGE/LOC', function () {
         var ff = ffetcher();
         ff.fetch();
         assert(fs.writeFileSync.called);
      })
   })
});
