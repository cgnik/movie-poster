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
        index.throttle = sinon.mock();
    })
    describe('#clear', function () {
        it('should empty the movieIds and the movieMap', function () {
            index.movieIds['alien'] = {'alien': '123'};
            index.movieIds.should.not.be.empty;
            index.clear();
            index.movieIds.should.be.empty;
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
            test = {};
            moviemap.getMovie = sinon.stub();
            moviemap.getMovie.withArgs('alien').returns(test);
            index.movieIds = {"alien": "123"};
            index.applyMovieIdsToMap();
            expect(moviemap.getMovie.calledOnce).to.be.true;
            expect(test.id).to.equal("123");
        })
        it('should tolerate ids for movies not in the map', function () {
            moviemap.getMovie = sinon.stub();
            moviemap.getMovie.withArgs('alien').returns(undefined);
            index.movieIds = {"alien": "123"};
            index.applyMovieIdsToMap();
            expect(moviemap.getMovie.calledOnce).to.be.true;
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
    describe('#enqueueMissingMovieImages', function () {
        it('should filter the movie map and add fetches for missing images', function () {
            testList = [{'id': 123, 'name': 'blah', 'image': '/path/blah.jpg'}, {'id': 345, 'name': 'bloo'}];
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.throttle.add = sinon.stub();
            index.enqueueSearchImages();
            index.throttle.add.should.have.been.calledOnce;
        })
    })
})