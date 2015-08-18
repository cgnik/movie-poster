/**
 * Created by christo on 8/15/15.
 */

describe('retriever', function () {
    retriever = require('../src/retriever.js');
    var r = null;
    beforeEach(function () {
        r = retriever();
        r.clear();
    })
    describe('#clear', function () {
        it('should empty the movieIds and the movieMap', function () {
            r.initMovieIds();
            r.movieIds.should.not.be.empty;
            r.movieMap.addMovieFile('/path/Alien.mpg');
            r.movieMap.should.not.be.empty;
            r.movieMap.movieMap.should.not.be.empty;
            r.clear();
            r.movieIds.should.be.empty;
            r.movieMap.movieMap.should.be.empty;
        })
    })
    describe('#initMoviedb', function () {
        it('should set the moviedb key from a file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            r.initMoviedb();
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
        it('should initialize from provided key and not the file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            r.themoviedbKey = "blahblah";
            r.initMoviedb();
            fs.readFileSync.should.have.not.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
    describe('#initMovieIds', function () {
        it('should load existing movie ids from a file', function () {
            sinon.stub(fs, 'readFileSync').withArgs('movie-ids.json').returns('{"aliens" : 679}');
            sinon.stub(fs, 'existsSync').withArgs('movie-ids.json').returns(true);
            r.initMovieIds();
            expect(r.movieIds['aliens']).to.equal(679);
            fs.readFileSync.should.have.been.calledWith('movie-ids.json');
            fs.readFileSync.restore();
            fs.existsSync.restore();
        })
    })
    describe('#initProcessArgs', function () {
        it('should make all -- arguments part of "this"', function () {
            props = ['--one=1', '--two=2'];
            r.initProcessArgs(props);
            expect(r.one).to.equal('1');
            expect(r.two).to.equal('2');
        })
        it('should make all non- -- arguments into additions to the movieMap', function () {
            props = ['--one=maximum', "/some/dir/"];
            sinon.stub(fs, 'statSync').withArgs('/some/dir/').returns({
                isDirectory: function () {
                    return true;
                }
            })
            r.init();
            sinon.stub(r.movieMap, 'addMovieDirectory');
            r.initProcessArgs(props);
            r.imagePath.should.be.empty;
            r.movieMap.addMovieDirectory.should.have.been.called;
            r.movieMap.addMovieDirectory.restore();
        })
        it('should check all file and dir arguments to see if they exist', function () {
            params = ['/dir/that/definitely/does/not/exist'];
            expect(r.initProcessArgs.bind(r, params)).to.throw();
        })
    })
    describe('#applyMovieIdsToMap', function () {
        it('should apply the movieIds to the movieMap by lower-case title', function () {
            r.clear();
            r.movieMap.addMovieFile("/path/Alien.mpg");
            r.movieIds = {"alien": "123"};
            r.applyMovieIdsToMap();
            r.movieMap.movieMap.should.deep.equal({"alien": {"id": "123", "name": "Alien", "file": "/path/Alien.mpg"}});
        })
    })
    describe('#findMissingMovieIds', function () {
        it('should figure out which mapped movies don"t have IDs', function () {
            r.clear();
            testObject = [{
                name: 'Alien',
                file: '/path/Alien.mpg',
                image: '/path/Alien.jpg'
            }, {"name": "Aliens", "file": "/path/Aliens.mpg"}];
            r.movieMap.addMovieFile("/path/Alien.mpg");
            r.movieMap.addMovieFile("/path/Alien.jpg");
            r.movieMap.addMovieFile("/path/Aliens.mpg");
            r.findMissingMovieIds().should.deep.equal(testObject);
        })
    })
    describe('#findMissingMovieImages', function () {
        it('should figure out which mapped movies don"t have imagess', function () {
            testObject = [{"name": "Aliens", "file": "/path/Aliens.mpg"}];
            r.movieMap.addMovieFile("/path/Alien.mpg");
            r.movieMap.addMovieFile("/path/Alien.jpg");
            r.movieMap.addMovieFile("/path/Aliens.mpg");
            r.findMissingMovieImages().should.deep.equal(testObject);
        })
    })
})