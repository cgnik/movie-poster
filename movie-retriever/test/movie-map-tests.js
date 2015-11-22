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
    MovieMap = require('../src/movie-map.js');
    mm = new MovieMap('/some/dir/');
    beforeEach(function () {
        mm.clear();
    });
    describe('#clear', function () {
        it('should clear map', function () {
            mm.movies['something'] = 'something-else';
            expect(mm.movies).to.not.be.empty;
            mm.clear();
            expect(mm.movies).to.be.empty;
        })
    })
    describe('#addMovieFiles', function () {
        it('should add movie files to the map, respecting existing entries', function () {
            mm.addMovieFiles(["/path/something.mpg", "/path/SomeThing.jpg"]);
            mm.movies.should.deep.equal({
                "something": {
                    "name": "something",
                    "file": "/path/something.mpg",
                    "image": "/path/SomeThing.jpg"
                }
            });
        })
    })
    describe('#toList', function () {
        mm.addMovieFile("/path/Something.mpg");
        mm.addMovieFile("/path/else.mpg");
        mm.toList().should.deep.equal([
            {"name": "Something", "file": "/path/Something.mpg"}, {
                "name": "else",
                "file": "/path/else.mpg"
            }]);
    })
    describe("#addMovieFile", function () {
        it('should add a movie file to the map, adding to existing entries', function () {
            mm.addMovieFile("/path/something.mpg");
            mm.movies.should.deep.equal({"something": {"name": "something", "file": "/path/something.mpg"}});
            mm.addMovieFile("/path/SomeThing.jpg");
            mm.movies.should.deep.equal({
                "something": {
                    "name": "something",
                    "file": "/path/something.mpg",
                    "image": "/path/SomeThing.jpg"
                }
            });
        })
        it('should preserve the case of the movie title in the name element but not in the key', function () {
            mm.addMovieFile("/path/Something.mpg");
            mm.movies.should.deep.equal({'something': {'name': 'Something', 'file': '/path/Something.mpg'}});
        })
    })
    describe('#getMovie', function () {
        it('should return a movie from the map if it has one for that id', function () {
            mm.addMovieFile("/path/something.mpg");
            mm.getMovie("something").should.deep.equal({'name': 'something', 'file': '/path/something.mpg'});
        })
    })
    describe('#isMovieExtension', function () {
        it('should identify a movie file regardless of case', function () {
            expect(mm.isMovieExtension('.M4V')).to.be.true;
            expect(mm.isMovieExtension('.mP4')).to.be.true;
            expect(mm.isMovieExtension('.mpg')).to.be.true;
            expect(mm.isMovieExtension('.vob')).to.be.true;
            expect(mm.isMovieExtension('.mkv')).to.be.true;
            expect(mm.isMovieExtension('.mpEg')).to.be.true;

            expect(mm.isMovieExtension('.png')).to.be.false;
            expect(mm.isMovieExtension('.GIF')).to.be.false;
            expect(mm.isMovieExtension('.Jpg')).to.be.false;
        })
    })
    describe('#isImageFile', function () {
        it('should identify a image file regardless of case', function () {
            expect(mm.isImageFile('.M4V')).to.be.false;
            expect(mm.isImageFile('.mP4')).to.be.false;
            expect(mm.isImageFile('.mpg')).to.be.false;
            expect(mm.isImageFile('.vob')).to.be.false;
            expect(mm.isImageFile('.mkv')).to.be.false;
            expect(mm.isImageFile('.mpEg')).to.be.false;

            expect(mm.isImageFile('.png')).to.be.true;
            expect(mm.isImageFile('.GIF')).to.be.true;
            expect(mm.isImageFile('.Jpg')).to.be.true;
        })
    })
    describe('#setMovieProperties', function () {
        it('should set the named property for the specified movie id to the specified value', function () {
            mm.addMovieFile("/path/some.mpg");
            mm.movies['some'].id = 123;
            mm.movies['some'].id.should.equal(123);
            expect(mm.movies['some'].prop).to.be.empty;
            mm.setMovieProperties(123, {'prop': 'propValue'});
            mm.movies['some'].prop.should.equal('propValue');
        })
    })
    describe('#keyify', function () {
        it('should make the provided string lower-case for use as a map key for the movie', function () {
            mm.keyify('BlAh').should.equal('blah');
        })
    })
});