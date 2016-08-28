fs = require('fs');
http = require('http');
PassThrough = require('stream').PassThrough;
Fetcher = require('../src/image-fetch.js');
ffetcher = function () {
    this.params = ({
        baseUrl: 'BASEURL',
        imagePath: 'IMAGE/PATH',
        imageLoc: 'IMAGE/LOC',
        fileName: 'FILENAME',
        http: http,
        fs: fs
    });
    return new Fetcher(this.params);
};
describe('ImageFetch', function () {
    var teststream = PassThrough();
    var testfile = PassThrough();

    beforeEach(function () {
        teststream.pipe = sinon.spy();
        sinon.stub(http, 'get').returns(teststream);
        testfile.write = sinon.spy();
        sinon.stub(fs, 'createWriteStream').returns(testfile);
    })
    afterEach(function () {
        http.get.restore();
        fs.createWriteStream.restore();
    })

    describe('#getUrl', function () {
        it('should assemble the url BASEURLw300IMAGE/LOC', function () {
            ffetcher().getUrl().should.equal('BASEURLw300IMAGE/LOC');
        })
    })
    describe('#getExtension', function () {
        it('should return ".ext" for file.ext', function () {
            fetcher = ffetcher();
            fetcher.imageLoc = 'file.ext';
            fetcher.getExtension().should.equal('.ext');
        })
        it('should return "" for file', function () {
            fetcher = ffetcher();
            expect(fetcher.getExtension()).to.equal('');
        })
        it('should tolerate a null imageLoc', function () {
            fetcher = ffetcher();
            fetcher.imageLoc = undefined;
            fetcher.getExtension.bind(fetcher, null).should.not.throw;
        })
    })
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
    })
    describe('#fetch', function () {
        it('should make a request to BASEURLw300IMAGE/LOC', function () {
            var ff = ffetcher();
            ff.fetch();
            assert(http.get.called);
            assert(fs.createWriteStream.called);
        })
    })
})
