fileList = ['/path/something.file', '/path/something.m4v', '/path/something.png', '/path/other.m4v'];
fileListMapResult = {
    something: {
        name: 'something',
        file: '/path/something.m4v',
        image: '/path/something.png',
        directory: '/path/'
    },
    other: {
        name: 'other',
        file: '/path/other.m4v',
        directory: '/path/'
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
                    "image": "/path/SomeThing.jpg",
                    "directory": "/path/"
                }
            });
        })
    })
    describe('#toList', function () {
        mm.addMovieFile("/path/Something.mpg");
        mm.addMovieFile("/path/else.mpg");
        mm.toList().should.deep.equal([
            {
                "name": "Something",
                "file": "/path/Something.mpg",
                "directory": "/path/"
            }, {
                "name": "else",
                "file": "/path/else.mpg",
                "directory": "/path/"
            }]);
    })
    describe("#addMovieFile", function () {
        it('should add a movie file to the map, adding to existing entries', function () {
            mm.addMovieFile("/path/something.mpg");
            mm.movies.should.deep.equal({
                "something": {
                    "name": "something", "file": "/path/something.mpg", "directory": "/path/"
                }
            });
            mm.addMovieFile("/path/SomeThing.jpg");
            mm.movies.should.deep.equal({
                "something": {
                    "name": "something",
                    "file": "/path/something.mpg",
                    "image": "/path/SomeThing.jpg",
                    "directory": "/path/"
                }
            });
        })
        it('should preserve the case of the movie title in the name element but not in the key', function () {
            mm.addMovieFile("/path/Something.mpg");
            mm.movies.should.deep.equal({
                'something': {
                    'name': 'Something', 'file': '/path/Something.mpg', "directory": "/path/"
                }
            });
        })
    })
    describe('#getMovie', function () {
        it('should return a movie from the map if it has one for that id', function () {
            mm.addMovieFile("/path/something.mpg");
            mm.getMovie("something").should.deep.equal({
                'name': 'something', 'file': '/path/something.mpg', "directory": "/path/"
            });
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
    describe('#getMovieById', function () {
        it('should retrieve a movie object when given the id', function () {
            mm.movies['aaa'] = {id: 012, "name": "AAA"};
            mm.movies['alien'] = {id: 123, "name": "Alien"};
            mm.movies['bobo'] = {id: 234, "name": "BoBo"};
            mm.getMovieById(123).should.deep.equal({id: 123, "name": "Alien"});
        })
    })
    describe('#load', function () {
        it('should look for the file', function () {
            fs = sinon.stub();
            fs.readFileSync = sinon.stub();
            fs.readFileSync.withArgs(mm.persistentMapFileName).returns(JSON.stringify(fileListMapResult));
            fs.existsSync = sinon.stub();
            fs.existsSync.withArgs(mm.persistentMapFileName).returns(true);
            fs.statSync = sinon.stub();
            fs.statSync.withArgs(mm.persistentMapFileName).returns({
                isFile: function () {
                    return true;
                }
            });
            mm.load();
            mm.movies.should.deep.equal(fileListMapResult);
            fs.existsSync.should.have.been.calledOnce;
            fs.statSync.should.have.been.called;
            fs.readFileSync.should.have.been.called;
        })
        it('should not try to load when file doesn not exist', function () {
            fs = sinon.stub();
            fs.readFileSync = sinon.stub();
            fs.readFileSync.withArgs(mm.persistentMapFileName).throws;
            fs.existsSync = sinon.stub();
            fs.existsSync.withArgs(mm.persistentMapFileName).returns(false);
            fs.statSync = sinon.stub();
            fs.statSync.withArgs(mm.persistentMapFileName).returns({
                isFile: function () {
                    return false;
                }
            });
            mm.load();
            fs.existsSync.should.have.been.calledOnce;
            fs.statSync.should.not.have.been.called;
            fs.readFileSync.should.not.have.been.called;
        })
    })
    describe('#persist', function () {
        it('should try to save the current movie map to a file', function () {
            fs = sinon.stub();
            mockStream = {
                close: sinon.stub(),
                write: sinon.stub()
            };
            mockStream.write.returns(mockStream);
            fs.createWriteStream = sinon.stub();
            fs.createWriteStream.withArgs('./movie-map.json').returns(mockStream);
            mm.directory = "./";
            mm.movies = fileListMapResult;
            mm.persist();
            fs.createWriteStream.should.have.been.calledWith('./movie-map.json');
            mockStream.write.should.have.been.calledWith(JSON.stringify(fileListMapResult));
            mockStream.close.should.have.been.calledOnce;
        })
    })
});