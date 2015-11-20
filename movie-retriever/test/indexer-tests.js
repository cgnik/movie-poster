/**
 * Created by christo on 8/15/15.
 */

describe('indexer', function () {
    Indexer = require('../src/indexer.js');
    index = null;
    moviemap = null;
    beforeEach(function () {
        moviemap = sinon.mock();
        index = new Indexer(moviemap);
    })
    describe('#clear', function () {
        it('should empty the movieIds and the movieMap', function () {
            index.movieIds['alien'] = { 'alien' : '123'};
            index.movieIds.should.not.be.empty;
            index.clear();
            index.movieIds.should.be.empty;
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
            moviemap.setMovieProperties = sinon.stub();
            index.movieIds = {"alien": "123"};
            index.applyMovieIdsToMap();
            expect(moviemap.setMovieProperties.calledOnce).to.be.truthy;
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
            testList = [{'id': 123, 'name': 'blah', 'image': '/path/image.jpg'}];
            testList = testList.concat(testObject);
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.findMissingMovieIds().should.deep.equal(testObject);
        })
    })
    describe('#findMissingMovieImages', function () {
        it('should figure out which mapped movies don"t have imagess', function () {
            testObject = [{"name": "Aliens", "file": "/path/Aliens.mpg"}];
            testList = [{'id': 123, 'name': 'blah', 'image': '/path/image.jpg'}];
            testList = testList.concat(testObject);
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.findMissingMovieImages().should.deep.equal(testObject);
        })
    })
})