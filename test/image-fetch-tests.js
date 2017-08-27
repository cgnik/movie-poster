fs = require('fs');

const fetchMock = require('fetch-mock');
const ImageFetch = MoviePoster.ImageFetch;
describe('ImageFetch', function () {
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
      sinon.stub(http, 'get').returns(teststream);
      testfile = {write: sinon.stub()};
      sinon.stub(fs, 'writeFileSync').returns(testfile);
   });
   afterEach(function () {
      http.get.restore();
      fs.writeFileSync.restore();
   });

   describe('#getUrl', function () {
      it('should assemble the url BASEURLw300IMAGE/LOC', function () {
         new ImageFetch(params).getUrl().should.equal('BASEURLw300IMAGE/LOC');
      })
   });
   describe('#getExtension', function () {
      it('should return ".ext" for file.ext', function () {
         fetcher = ImageFetch(params);
         fetcher.imageLoc = 'file.ext';
         fetcher.getExtension().should.equal('.ext');
      });
      it('should return "" for file', function () {
         fetcher = new ImageFetch(params);
         expect(fetcher.getExtension()).to.equal('');
      });
      it('should tolerate a null imageLoc', function () {
         fetcher = new ImageFetch(params);
         fetcher.imageLoc = undefined;
         fetcher.getExtension.bind(fetcher, null).should.not.throw;
      })
   });
   describe('#getTargetFile', function () {
      it('should return "IMAGE/PATH/target.ext" for IMAGE/LOC, file',
         function () {
            fetcher = new ImageFetch(params);
            fetcher.imageLoc = 'file.ext';
            fetcher.imagePath = 'IMAGE/PATH';
            fetcher.fileName = 'target';
            expect(fetcher.getTargetFile()).to
               .equal('IMAGE/PATH/target.ext');
         })
   });
   describe('#fetch', function () {
      it('should make a request to BASEURLw300IMAGE/LOC', function () {
         var ff = new ImageFetch(params);
         ff.fetch();
         assert(fs.writeFileSync.called);
      })
   })
});
