/**
 * Created by christo on 9/5/15.
 */
let MovieMap = sinon.mock(require('../src/movie-map.js'));
let Main = require('../src/main.js');

describe('Main', function () {

    var main = null;
    beforeEach(function () {
        main = new Main();
    })
    describe('#initMoviedb', function () {
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
        it('should make all -- arguments part of "this"', function () {
            props = ['node.command', 'script.myself', '--one=1', '--two=2'];
            main.initProcessArgs(props);
            main.one.should.equal('1');
            main.two.should.equal('2');
        })
        it('should make non-"--" arguments into main.dirs entries', function () {
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
        it('should initialize the indexer and moviedb', function () {
            sinon.stub(fs, 'readFileSync').returns('blahblah');
            sinon.createStubInstance(Indexer);

            main.directories = ['./'];
            main.process();
            main.indexers['./'].should.exist;
            console.log(main.indexers['./'].initialize);
            // FIXME: the following line doesn't work because can't seem to stub the return from the Indexer.constructor so that it
            // still has stubbed methods from Indexer
            // main.indexers['./'].initialize.should.have.been.calledOnce;
            fs.readFileSync.should.have.been.calledWith('themoviedb-key.txt');
            fs.readFileSync.restore();
        })
    })
})