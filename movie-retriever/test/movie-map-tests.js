fileList = ['/path/something.file', '/path/something.m4v', '/path/something.png', '/path/other.m4v'];
fileListMapResult = {
    something: {
        id: null,
        name: 'something',
        file: '/path/something.m4v',
        image: '/path/something.png'
    },
    other: {
        id: null,
        file: '/path/other.m4v',
        image: null
    }
};

describe('MovieMap', function () {
    mim = require('../src/movie-map.js');
    describe('#clear', function () {
        mim.movieMap['something'] = 'something-else';
        mim.movieDirectories.push('/some/path');
        expect(mim.movieMap).to.not.be.empty;
        expect(mim.movieDirectories).to.not.be.empty;
        mim.clear();
        expect(mim.movieMap).to.be.empty;
        expect(mim.movieDirectories).to.be.empty;
    })
    describe("#addMovieFile", function () {

    })
    describe('#addMovieFiles', function () {

    })
    describe('#addMOvieDirectory', function () {

    })
    describe('#isImageFile', function () {

    })
    describe('#isMovieFile', function () {
        it('should identify a movie file regardless of case', function () {
            expect(mim.isMovieFile('IMAGE.M4V')).to.be.true;
            expect(mim.isMovieFile('DORK.mP4')).to.be.true;
            expect(mim.isMovieFile('DORK.mpg')).to.be.true;
            expect(mim.isMovieFile('DORK.vob')).to.be.true;
            expect(mim.isMovieFile('DORK.mkv')).to.be.true;
            expect(mim.isMovieFile('DORK.mpEg')).to.be.true;
            
            expect(mim.isMovieFile('DORK.png')).to.be.false;
            expect(mim.isMovieFile('DORK.GIF')).to.be.false;
            expect(mim.isMovieFile('DORK.Jpg')).to.be.false;
        })
    })
    describe('#isImageFile', function () {
        it('should identify a image file regardless of case', function () {
            expect(mim.isImageFile('IMAGE.M4V')).to.be.false;
            expect(mim.isImageFile('DORK.mP4')).to.be.false;
            expect(mim.isImageFile('DORK.mpg')).to.be.false;
            expect(mim.isImageFile('DORK.vob')).to.be.false;
            expect(mim.isImageFile('DORK.mkv')).to.be.false;
            expect(mim.isImageFile('DORK.mpEg')).to.be.false;

            expect(mim.isImageFile('DORK.png')).to.be.true;
            expect(mim.isImageFile('DORK.GIF')).to.be.true;
            expect(mim.isImageFile('DORK.Jpg')).to.be.true;
        })
    })
});