/**
 * Created by christo on 8/15/15.
 */

describe('retriever', function () {
    retriever = require('../src/retriever.js');
    describe('#initMoviedb', function () {
        it('should set the moviedb key from a file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            retriever().initMoviedb();
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
        it('should initialize from provided key and not the file', function () {
            retriever = require('../src/retriever.js');
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            var r = retriever();
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
            m = retriever();
            m.initMovieIds();
            expect(m.movieIds['aliens']).to.equal(679);
            fs.readFileSync.should.have.been.calledWith('movie-ids.json');
            fs.readFileSync.restore();
            fs.existsSync.restore();
        })
    })
    describe('#initProcessArgs', function () {
        it('should make all -- arguments part of "this"', function () {
            props = ['--one=1', '--two=2'];
            m = retriever();
            m.initProcessArgs(props);
            expect(m.one).to.equal('1');
            expect(m.two).to.equal('2');
        })
        it('should make all non- -- arguments into additions to the movieMap', function () {
            props = ['--one=maximum', "/some/dir/"];
            sinon.stub(fs, 'statSync').withArgs('/some/dir/').returns({
                isDirectory: function () {
                    return true;
                }
            })
            m = retriever();
            m.init();
            sinon.stub(m.movieMap, 'addMovieDirectory');
            m.initProcessArgs(props);
            m.imagePath.should.be.empty;
            m.movieMap.addMovieDirectory.should.have.been.called;
            m.movieMap.addMovieDirectory.restore();
        })
        it('should check all file and dir arguments to see if they exist', function () {
            params = ['/dir/that/definitely/does/not/exist'];
            m = retriever();
            expect(m.initProcessArgs.bind(m, params)).to.throw();
        })
    })
    describe('#findMissingMovieIds', function () {
        it('should figure out which mapped movies don"t have IDs', function () {
            testObject = [{
                name: 'Alien',
                file: '/path/Alien.mpg',
                image: '/path/Alien.jpg'
            }, {"name": "Aliens", "file": "/path/Aliens.mpg"}];
            m.movieMap.addMovieFile("/path/Alien.mpg");
            m.movieMap.addMovieFile("/path/Alien.jpg");
            m.movieMap.addMovieFile("/path/Aliens.mpg");
            m.findMissingMovieIds().should.deep.equal(testObject);
        })
    })
    describe('#findMissingMovieImages', function () {
        it('should figure out which mapped movies don"t have imagess', function () {
            testObject = [{"name": "Aliens", "file": "/path/Aliens.mpg"}];
            m.movieMap.addMovieFile("/path/Alien.mpg");
            m.movieMap.addMovieFile("/path/Alien.jpg");
            m.movieMap.addMovieFile("/path/Aliens.mpg");
            m.findMissingMovieImages().should.deep.equal(testObject);
        })
    })
    describe('#applyMovieIdsToMap', function () {
        it('should apply the movieIds to the movieMap by lower-case title', function () {
            m.movieMap.clear();
            m.movieMap.addMovieFile("/path/Alien.mpg");
            m.movieIds = {"alien": "123"};
            m.applyMovieIdsToMap();
            m.movieMap.movieMap.should.deep.equal({"alien": {"id": "123", "name": "Alien", "file": "/path/Alien.mpg"}});
        })
    })
})