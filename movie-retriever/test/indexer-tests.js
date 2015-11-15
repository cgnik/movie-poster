/**
 * Created by christo on 8/15/15.
 */

describe('indexer', function () {
    Indexer = require('../src/indexer.js');
    var index = null;
    beforeEach(function () {
        index = new Indexer();
        index.clear();
    })
    describe('#clear', function () {
        it('should empty the movieIds and the movieMap', function () {
            index.initMovieIds();
            index.add
            index.movieIds.should.be.empty;
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