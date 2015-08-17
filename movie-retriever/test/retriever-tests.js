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
            var m = retriever();
            m.themoviedbKey = "blahblah";
            m.initMoviedb();
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

})