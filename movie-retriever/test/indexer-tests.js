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
    describe('#findFetchableImages', function () {
        it('should reply with a list of movies with an imageLoc property and no image file', function () {
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
    describe('#enqueueFetchImages', function () {
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
        //afterEach(function () {
        //    index.enqueueFetchImage.restore();
        //    moviemap.toList.restore();
        //    index.throttle.add.restore();
        //})
        it('should call enqueueFetchImage for every imageUrl+no_imagefile in the map', function () {
            index.enqueueFetchImages();
            index.enqueueFetchImage.should.have.been.calledOnce;
        })
        it('should enqueue this.finish() after all of the image fetches', function () {
            index.enqueueFetchImages();
            index.enqueueFetchImage.should.have.been.calledOnce;
        })
        it('should not enqueue movies missing an id', function () {
            index.enqueueFetchImages();
            index.enqueueFetchImage.should.have.been.calledOnce;
        })
    })
    describe('#enqueueSearchImages', function () {
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
            index.enqueueSearchImage = sinon.stub();
        })
        it('should call enqueueSearchImage for every imageless movie in the map', function () {
            index.enqueueSearchImages();
            index.enqueueSearchImage.should.have.been.calledThrice;
        })
    })
    describe('#enqueueMissingIds', function () {
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
        })
        it('should call enqueueMissingId for every id-less movie in the map', function () {
            index.enqueueMissingIds();
            index.enqueueMissingId.should.have.been.calledTwice;
        })
    })
})