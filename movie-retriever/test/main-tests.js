/**
 * Created by christo on 9/5/15.
 */
Main = require('../src/main.js');
MovieMap = require('../src/main.js');
Indexer = require('../src/indexer.js');

describe('Main', function () {
    var main = null;
    describe('#initMoviedb', function () {
        beforeEach(function () {
            main = new Main();
            main.movieMap = sinon.mock(MovieMap.prototype);
        })
        it('should set the moviedb key from a file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main.initMoviedb();
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
        it('should initialize from provided key and not the file', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main.themoviedbKey = "blahblah";
            main.initMoviedb();
            fs.readFileSync.should.have.not.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
    describe('#initProcessArgs', function () {
        beforeEach(function () {
            main = new Main();
            main.movieMap = sinon.mock(MovieMap.prototype);
        })
        it('should make all -- arguments part of "this"', function () {
            props = ['node.command', 'script.myself', '--one=1', '--two=2'];
            main.initProcessArgs(props);
            main.one.should.equal('1');
            main.two.should.equal('2');
        })
        it('should make non-"--" arguments into a movie map', function () {
            main.movieMap.expects('initialize').once().withExactArgs('/some/dir/');
            props = ['node.command', 'self.scriptline', '--one=maximum', "/some/dir/"];
            statSyncStub = sinon.stub(fs, 'statSync');
            statSyncStub.withArgs('/some/dir/').returns({
                isDirectory: function () {
                    return true;
                }
            });
            statSyncStub.withArgs('/some/dir/file.mpg').returns({
                isDirectory: function () {
                    return false;
                },
                isFile: function () {
                    return true;
                }
            })
            main.initProcessArgs(props);
            main.directories.should.deep.equal(['/some/dir/']);
        })
        it('should check all file and dir arguments to see if they exist', function () {
            params = ['/dir/that/definitely/does/not/exist'];
            expect(main.initProcessArgs.bind(main, params)).to.throw;
        })
    })
    describe('#process', function () {
        beforeEach(function () {
            main = new Main();
            main.indexer = sinon.mock(main.indexer.constructor.prototype);
            main.indexer.initialize = sinon.stub();
        })
        it('should initialize the indexer', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            main.process();
            main.indexer.initialize.calledOnce.should.be.true;
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
})