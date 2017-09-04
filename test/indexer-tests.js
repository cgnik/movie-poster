/**
 * Created by christo on 8/15/15.
 */

let MovieDb = require('../src/moviedb-moviedb.js');

describe('Indexer', () => {
    let Indexer = require('../src/indexer.js');
    index = null;
    moviemap = null;

    beforeEach(function () {
        let movieDb = sinon.mock(MovieDb);
        movieDb.Events = MovieDb.Events;
        movieDb.on = sinon.stub();
        index = new Indexer(movieDb);
        moviemap = index.movieMap;
        index.throttle = sinon.mock();
    });
    describe('#clear', () => {
        it('should empty the movieIds and the movieMap', () => {
            index.movieIds['alien'] = {'alien': '123'};
            index.movieIds.should.not.be.empty;
            index.clear();
            index.movieIds.should.be.empty;
        })
    });
    describe('#applyMovieIdsToMap', () => {
        it('should apply the movieIds to the movieMap by lower-case title', () => {
            test = {};
            moviemap.getMovie = sinon.stub();
            moviemap.getMovie.withArgs('alien').returns(test);
            index.movieIds = {"alien": "123"};
            index.applyMovieIdsToMap();
            expect(moviemap.getMovie.calledOnce).to.be.true;
            expect(test.id).to.equal("123");
        });
        it('should tolerate ids for movies not in the map', () => {
            moviemap.getMovie = sinon.stub();
            moviemap.getMovie.withArgs('alien').returns(undefined);
            index.movieIds = {"alien": "123"};
            index.applyMovieIdsToMap();
            expect(moviemap.getMovie.calledOnce).to.be.true;
        })
    });
    describe('#findMissingMovieIds', () => {
        it('should figure out which mapped movies don"t have IDs', () => {
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
    });
    describe('#findMissingMovieImages', () => {
        it('should figure out which mapped movies don"t have imagess', () => {
            testObject = [{"name": "Aliens", "file": "/path/Aliens.mpg"}];
            testList = [{'id': 123, 'name': 'blah', 'image': '/path/image.jpg'}];
            testList = testList.concat(testObject);
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.findMissingMovieImages().should.deep.equal(testObject);
        })
    });
    describe('#findFetchableImages', () => {
        it('should reply with a list of movies with an imageLoc property and no image file', () => {
            testObject = [{"name": "Aliens", "file": "/path/Aliens.mpg", "imageLoc": "url/url/url"}];
            testList = [{'id': 123, 'name': 'blah', 'image': '/path/image.jpg'}, {
                'id': 456,
                'name': 'blah2',
                'imageLoc': "/something/something",
                'image': '/path/image2.jpg'
            }, {'id': 789, 'name': 'blah3'}];
            testList = testList.concat(testObject);
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.findFetchableImages().should.deep.equal(testObject);
        })
    });
    describe('#enqueueMissingMovieImages', () => {
        it('should filter the movie map and add fetches for missing images', () => {
            testList = [{'id': 123, 'name': 'blah', 'image': '/path/blah.jpg'}, {'id': 345, 'name': 'bloo'}];
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.throttle.add = sinon.stub();
            index.enqueueSearchImages();
            index.throttle.add.should.have.been.calledOnce;
        })
    });
    describe('#enqueueFetchImages', () => {
        beforeEach(function () {
            testObject = {'id': 789, 'name': 'bloob', "imageLoc": "/some/location/"};
            testList = [{"name": "blaa", "imageLoc": "/some/path/"}, {
                'id': 123,
                'name': 'blah',
                'image': '/path/blah.jpg'
            }, {
                'id': 345,
                'name': 'blooa'
            }, testObject];
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.throttle.add = sinon.stub();
            index.enqueueFetchImage = sinon.stub();
        })
    });
    describe('#enqueueSearchImages', () => {
        beforeEach(function () {
            var testObject = {'id': 789, 'name': 'bloob', "imageLoc": "/some/location/"};
            var testList = [{"name": "blaa", "imageLoc": "/some/path/"}, {
                'id': 123,
                'name': 'blah',
                'image': '/path/blah.jpg'
            }, {
                'id': 345,
                'name': 'blooa'
            }, testObject];
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.throttle.add = sinon.stub();
            index.enqueueSearchImage = sinon.stub();
        });
        it('should call enqueueSearchImage for every imageless movie in the map which has a movieId', () => {
            index.enqueueSearchImages();
            moviemap.toList.should.have.been.calledOnce;
            index.enqueueSearchImage.should.have.been.calledTwice;
            index.enqueueSearchImage.should.have.been.calledWith(789);
            index.enqueueSearchImage.should.have.been.calledWith(345);
        })
    });
    describe('#enqueueMissingIds', () => {
        beforeEach(function () {
            testObject = {'name': 'bloob', "file": "/some/file.mpg"};
            testList = [{"name": "blaa", "imageLoc": "/some/path/"}, {
                'id': 123,
                'name': 'blah',
                'image': '/path/blah.jpg'
            }, {
                'id': 345,
                'name': 'blooa'
            }, testObject];
            moviemap.toList = sinon.stub();
            moviemap.toList.returns(testList);
            index.throttle.add = sinon.stub();
            index.enqueueMissingId = sinon.stub();
        });
        it('should call enqueueMissingId for every id-less movie in the map', () => {
            index.enqueueMissingIds();
            index.enqueueMissingId.should.have.been.calledTwice;
        })
    })
});