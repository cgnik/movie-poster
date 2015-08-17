fileList = ['/path/something.file', '/path/something.m4v', '/path/something.png', '/path/other.m4v'];
fileListMapResult = {
    something: {
        name: 'something',
        file: '/path/something.m4v',
        image: '/path/something.png'
    },
    other: {
        name: 'other',
        file: '/path/other.m4v',
    }
};

describe('MovieMap', function () {
    mim = require('../src/movie-map.js');
    beforeEach(function () {
        mim.clear();
    })
    describe('#clear', function () {
        it('should clear both map and directories', function () {
            mim.movieMap['something'] = 'something-else';
            mim.movieDirectories.push('/some/path');
            expect(mim.movieMap).to.not.be.empty;
            expect(mim.movieDirectories).to.not.be.empty;
            mim.clear();
            expect(mim.movieMap).to.be.empty;
            expect(mim.movieDirectories).to.be.empty;
        })
    })
    describe('#addMovieDirectory', function () {
        sinon.stub(fs, 'readdirSync').withArgs('/path/').returns(fileList);
        mim.clear();
        expect(mim.movieDirectories).to.be.empty;
        mim.addMovieDirectory('/path/');
        expect(mim.movieDirectories).to.not.be.empty;
        expect(mim.movieDirectories).to.deep.equal(['/path/']);
        mim.movieMap.should.deep.equal(fileListMapResult);
        fs.readdirSync.restore();
    })
    describe('#addMovieFiles', function () {
        it('should add movie files to the map, respecting existing entries', function () {
            mim.addMovieFiles(["/path/something.mpg", "/path/SomeThing.jpg"]);
            mim.movieMap.should.deep.equal({
                "something": {
                    "name": "something",
                    "file": "/path/something.mpg",
                    "image": "/path/SomeThing.jpg"
                }
            });
        })
    })
    describe("#addMovieFile", function () {
        it('should add a movie file to the map, taking care to augment existing entries when there', function () {
            mim.addMovieFile("/path/something.mpg");
            mim.movieMap.should.deep.equal({"something": {"name": "something", "file": "/path/something.mpg"}});
            mim.addMovieFile("/path/SomeThing.jpg");
            mim.movieMap.should.deep.equal({
                "something": {
                    "name": "something",
                    "file": "/path/something.mpg",
                    "image": "/path/SomeThing.jpg"
                }
            });
        })
    })
    describe('#isMovieExtension', function () {
        it('should identify a movie file regardless of case', function () {
            expect(mim.isMovieExtension('.M4V')).to.be.true;
            expect(mim.isMovieExtension('.mP4')).to.be.true;
            expect(mim.isMovieExtension('.mpg')).to.be.true;
            expect(mim.isMovieExtension('.vob')).to.be.true;
            expect(mim.isMovieExtension('.mkv')).to.be.true;
            expect(mim.isMovieExtension('.mpEg')).to.be.true;

            expect(mim.isMovieExtension('.png')).to.be.false;
            expect(mim.isMovieExtension('.GIF')).to.be.false;
            expect(mim.isMovieExtension('.Jpg')).to.be.false;
        })
    })
    describe('#isImageFile', function () {
        it('should identify a image file regardless of case', function () {
            expect(mim.isImageFile('.M4V')).to.be.false;
            expect(mim.isImageFile('.mP4')).to.be.false;
            expect(mim.isImageFile('.mpg')).to.be.false;
            expect(mim.isImageFile('.vob')).to.be.false;
            expect(mim.isImageFile('.mkv')).to.be.false;
            expect(mim.isImageFile('.mpEg')).to.be.false;

            expect(mim.isImageFile('.png')).to.be.true;
            expect(mim.isImageFile('.GIF')).to.be.true;
            expect(mim.isImageFile('.Jpg')).to.be.true;
        })
    })
});