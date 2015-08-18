/**
 * Created by christo on 8/15/15.
 */

describe('indexer', function () {
    indexer = require('../src/indexer.js');
    var index = null;
    beforeEach(function () {
        index = indexer();
        index.clear();
    })
    describe('#clear', function () {
        it('should empty the movieIds and the movieMap', function () {
            index.initMovieIds();
            index.movieIds.should.not.be.empty;
            index.movieMap.addMovieFile('/path/Alien.mpg');
            index.movieMap.should.not.be.empty;
            index.movieMap.movieMap.should.not.be.empty;
            index.clear();
            index.movieIds.should.be.empty;
            index.movieMap.movieMap.should.be.empty;
        })
    })
    describe('#initMoviedb', function () {
        it('should set the moviedb key from a file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            index.initMoviedb();
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
        it('should initialize from provided key and not the file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            index.themoviedbKey = "blahblah";
            index.initMoviedb();
            fs.readFileSync.should.have.not.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
    describe('#initMovieIds', function () {
        it('should load existing movie ids from a file', function () {
            sinon.stub(fs, 'readFileSync').withArgs('movie-ids.json').returns('{"aliens" : 679}');
            sinon.stub(fs, 'existsSync').withArgs('movie-ids.json').returns(true);
            index.initMovieIds();
            expect(index.movieIds['aliens']).to.equal(679);
            fs.readFileSync.should.have.been.calledWith('movie-ids.json');
            fs.readFileSync.restore();
            fs.existsSync.restore();
        })
    })
    describe('#initProcessArgs', function () {
        it('should make all -- arguments part of "this"', function () {
            props = ['--one=1', '--two=2'];
            index.initProcessArgs(props);
            expect(index.one).to.equal('1');
            expect(index.two).to.equal('2');
        })
        it('should make all non- -- arguments into additions to the movieMap', function () {
            props = ['--one=maximum', "/some/dir/"];
            sinon.stub(fs, 'statSync').withArgs('/some/dir/').returns({
                isDirectory: function () {
                    return true;
                }
            })
            index.init();
            sinon.stub(index.movieMap, 'addMovieDirectory');
            index.initProcessArgs(props);
            index.movieMap.addMovieDirectory.should.have.been.called;
            index.movieMap.addMovieDirectory.restore();
        })
        it('should check all file and dir arguments to see if they exist', function () {
            params = ['/dir/that/definitely/does/not/exist'];
            expect(index.initProcessArgs.bind(index, params)).to.throw();
        })
    })
    describe('#applyMovieIdsToMap', function () {
        it('should apply the movieIds to the movieMap by lower-case title', function () {
            index.clear();
            index.movieMap.addMovieFile("/path/Alien.mpg");
            index.movieIds = {"alien": "123"};
            index.applyMovieIdsToMap();
            index.movieMap.movieMap.should.deep.equal({
                "alien": {
                    "id": "123",
                    "name": "Alien",
                    "file": "/path/Alien.mpg"
                }
            });
        })
    })
    describe('#findMissingMovieIds', function () {
        it('should figure out which mapped movies don"t have IDs', function () {
            index.clear();
            testObject = [{
                name: 'Alien',
                file: '/path/Alien.mpg',
                image: '/path/Alien.jpg'
            }, {"name": "Aliens", "file": "/path/Aliens.mpg"}];
            index.movieMap.addMovieFile("/path/Alien.mpg");
            index.movieMap.addMovieFile("/path/Alien.jpg");
            index.movieMap.addMovieFile("/path/Aliens.mpg");
            index.findMissingMovieIds().should.deep.equal(testObject);
        })
    })
    describe('#findMissingMovieImages', function () {
        it('should figure out which mapped movies don"t have imagess', function () {
            testObject = [{"name": "Aliens", "file": "/path/Aliens.mpg"}];
            index.movieMap.addMovieFile("/path/Alien.mpg");
            index.movieMap.addMovieFile("/path/Alien.jpg");
            index.movieMap.addMovieFile("/path/Aliens.mpg");
            index.findMissingMovieImages().should.deep.equal(testObject);
        })
    })
})